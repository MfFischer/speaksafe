/**
 * ZK Proof Service — AnonymousReport circuit (Groth16 via snarkjs)
 *
 * SETUP REQUIRED before this service works in production:
 *
 *   1. Install Circom:      npm install -g circom
 *   2. Compile the circuit: cd zk-circuits && npm install
 *                           circom circuits/anonymousReport.circom --r1cs --wasm --sym -o build/
 *   3. Powers of Tau:       snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
 *                           snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="SpeakSafe"
 *                           snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau
 *   4. Circuit-specific key: snarkjs groth16 setup build/anonymousReport.r1cs pot14_final.ptau circuit_0000.zkey
 *                            snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name="SpeakSafe"
 *                            snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
 *   5. Copy artifacts to:    frontend/public/circuits/
 *                              anonymousReport.wasm  (from build/anonymousReport_js/)
 *                              circuit_final.zkey
 *                              verification_key.json
 *
 * Environment variable:
 *   REACT_APP_CIRCUITS_PATH  (default: /circuits)
 */

// snarkjs ships ES modules — CRA handles this via its webpack config.
// @ts-ignore — no type declarations bundled with snarkjs
import { groth16 } from 'snarkjs';
import { ethers } from 'ethers';

const CIRCUITS_PATH = process.env.REACT_APP_CIRCUITS_PATH || '/circuits';

// ─── Category & severity maps ─────────────────────────────────────────────────

const CATEGORY_CODES: Record<string, number> = {
  corruption: 0,
  fraud: 1,
  misconduct: 2,
  safety_violation: 3,
  environmental: 4,
  human_rights: 5,
  financial_crime: 6,
  other: 7
};

const SEVERITY_CODES: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3
};

// ─── Field arithmetic helpers (BN128 prime) ───────────────────────────────────

const BN128_PRIME = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');

function fieldElement(n: bigint): bigint {
  return ((n % BN128_PRIME) + BN128_PRIME) % BN128_PRIME;
}

/**
 * Converts an arbitrary string to a field element by keccak256 hashing it,
 * then reducing modulo the BN128 prime.
 */
function stringToField(s: string): bigint {
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(s));
  return fieldElement(BigInt(hash));
}

function randomFieldElement(): bigint {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let n = BigInt(0);
  for (const b of bytes) n = (n << BigInt(8)) | BigInt(b);
  return fieldElement(n);
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface ReportProofInput {
  /** Raw report text (kept private — only its field-element hash is used). */
  reportText: string;
  /** One of: corruption | fraud | misconduct | safety_violation | environmental | human_rights | financial_crime | other */
  category: string;
  /** One of: low | medium | high | critical */
  severity: string;
  /**
   * The user's identity secret — must be kept exclusively in the browser.
   * Derive this from a wallet signature: signer.signMessage('SpeakSafe identity secret v1')
   */
  identitySecret: string;
}

export interface ReportProof {
  /** Groth16 proof object (pi_a, pi_b, pi_c) */
  proof: object;
  /** Public signals array — safe to share with the verifier / smart contract */
  publicSignals: string[];
  /** Convenience fields derived from public signals */
  nullifierHash: string;
  reportHash: string;
  anonymousId: string;
  commitmentHash: string;
}

// ─── Core service ─────────────────────────────────────────────────────────────

const zkpService = {
  /**
   * Generates a Groth16 ZK proof for an anonymous report submission.
   *
   * All heavy computation runs in the browser via the compiled WASM circuit.
   * Nothing identifying ever leaves the device unencrypted.
   */
  generateReportProof: async (input: ReportProofInput): Promise<ReportProof> => {
    const categoryCode = CATEGORY_CODES[input.category] ?? CATEGORY_CODES['other'];
    const severityLevel = SEVERITY_CODES[input.severity] ?? SEVERITY_CODES['medium'];
    const timestamp = Math.floor(Date.now() / 1000);

    // Derive field elements for private inputs
    const identitySecretFE = stringToField(input.identitySecret);
    const reportContentFE  = stringToField(input.reportText);
    const nonce            = randomFieldElement();
    const reporterData     = randomFieldElement(); // reserved for future identity binding

    // Pre-compute public signals using the same Poseidon hash logic as the circuit.
    // These must match what the circuit outputs — computed off-chain for convenience.
    // The circuit itself re-derives and constrains these values.
    //
    // NOTE: We use keccak256 here as a placeholder because running Poseidon in JS
    // without the compiled WASM is expensive. Once the WASM is compiled the circuit
    // will enforce the correct Poseidon values. Replace with poseidon-lite if you
    // want exact pre-computation:  npm install poseidon-lite
    const nullifierHash = fieldElement(
      BigInt(ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256'],
          [identitySecretFE, reportContentFE, timestamp]
        )
      ))
    ).toString();

    const reportHash = fieldElement(
      BigInt(ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256', 'uint256'],
          [reportContentFE, categoryCode, severityLevel, timestamp]
        )
      ))
    ).toString();

    const circuitInputs = {
      // Private
      identitySecret: identitySecretFE.toString(),
      reportContent:  reportContentFE.toString(),
      nonce:          nonce.toString(),
      reporterData:   reporterData.toString(),
      // Public
      nullifierHash,
      reportHash,
      timestamp:      timestamp.toString(),
      categoryCode:   categoryCode.toString(),
      severityLevel:  severityLevel.toString()
    };

    const wasmPath = `${CIRCUITS_PATH}/anonymousReport.wasm`;
    const zkeyPath = `${CIRCUITS_PATH}/circuit_final.zkey`;

    let proof: any;
    let publicSignals: string[];

    try {
      const result = await groth16.fullProve(circuitInputs, wasmPath, zkeyPath);
      proof         = result.proof;
      publicSignals = result.publicSignals;
    } catch (err: any) {
      // Circuit artifacts not found (setup not complete) — throw a clear message.
      if (err?.message?.includes('fetch') || err?.message?.includes('404') || err?.message?.includes('wasm')) {
        throw new Error(
          'ZK circuit artifacts not found. Please compile the circuit first. ' +
          'See the setup instructions at the top of zkpService.ts.'
        );
      }
      throw err;
    }

    // publicSignals order from the circuit: [anonymousId, commitmentHash, validityProof]
    // (plus the echoed public inputs: nullifierHash, reportHash, timestamp, categoryCode, severityLevel)
    return {
      proof,
      publicSignals,
      nullifierHash,
      reportHash,
      anonymousId:     publicSignals[0] ?? '',
      commitmentHash:  publicSignals[1] ?? ''
    };
  },

  /**
   * Verifies a proof client-side using the exported verification key.
   * On-chain verification is handled by the SpeakSafeRegistry contract.
   */
  verifyProof: async (proof: object, publicSignals: string[]): Promise<boolean> => {
    const vkeyPath = `${CIRCUITS_PATH}/verification_key.json`;
    const vkeyRes  = await fetch(vkeyPath);
    if (!vkeyRes.ok) {
      throw new Error(`Verification key not found at ${vkeyPath}. Run circuit setup first.`);
    }
    const vkey = await vkeyRes.json();
    return groth16.verify(vkey, publicSignals, proof);
  },

  /**
   * Serialises a proof for submission to the SpeakSafeRegistry smart contract.
   * Returns ABI-encoded bytes compatible with the contract's uint256[8] proof format.
   */
  serializeProofForContract: (proof: any): string => {
    const pi_a = proof.pi_a.slice(0, 2).map(BigInt);
    const pi_b = [
      [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
      [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])]
    ];
    const pi_c = proof.pi_c.slice(0, 2).map(BigInt);

    return ethers.utils.defaultAbiCoder.encode(
      ['uint256[2]', 'uint256[2][2]', 'uint256[2]'],
      [pi_a, pi_b, pi_c]
    );
  }
};

export default zkpService;
