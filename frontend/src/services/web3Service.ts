import { ethers } from 'ethers';

// ─── Encryption helpers (Web Crypto API — AES-GCM 256-bit) ───────────────────

/**
 * Derives a 256-bit AES-GCM key from a passphrase using PBKDF2.
 * The salt is stored alongside the ciphertext so decryption is possible
 * without a shared secret beyond the passphrase itself.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts plaintext with AES-GCM.
 * Returns a base64 string encoding: [16-byte salt | 12-byte IV | ciphertext].
 *
 * The passphrase should be a randomly generated secret kept only on the
 * client (e.g. derived from the user's wallet signature).
 */
async function encryptAESGCM(plaintext: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  // Pack: salt(16) + iv(12) + ciphertext
  const packed = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  packed.set(salt, 0);
  packed.set(iv, salt.byteLength);
  packed.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

  // Chunk the spread to avoid "Maximum call stack exceeded" on large ciphertexts.
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < packed.length; i += chunkSize) {
    binary += String.fromCharCode(...packed.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Decrypts a payload produced by encryptAESGCM.
 */
async function decryptAESGCM(packed64: string, passphrase: string): Promise<string> {
  const packed = Uint8Array.from(atob(packed64), c => c.charCodeAt(0));
  const salt       = packed.slice(0, 16);
  const iv         = packed.slice(16, 28);
  const ciphertext = packed.slice(28);

  const key = await deriveKey(passphrase, salt);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

  return new TextDecoder().decode(plainBuf);
}

// ─── Public service ───────────────────────────────────────────────────────────

const web3Service = {
  /**
   * Deterministic keccak256 hash of the report content.
   * Used as the on-chain commitment — does NOT reveal report content.
   */
  generateReportHash: async (content: string): Promise<string> => {
    return ethers.utils.id(content);
  },

  /**
   * Encrypts data with AES-GCM 256-bit.
   * Pass a wallet-derived passphrase (e.g. sign a fixed message with the
   * user's private key and use the hex signature as the passphrase).
   *
   * Example:
   *   const sig = await signer.signMessage('SpeakSafe encryption key v1');
   *   const encrypted = await web3Service.encryptData(reportContent, sig);
   */
  encryptData: async (data: string, passphrase: string): Promise<string> => {
    return encryptAESGCM(data, passphrase);
  },

  /**
   * Decrypts data previously encrypted by encryptData.
   */
  decryptData: async (encryptedData: string, passphrase: string): Promise<string> => {
    return decryptAESGCM(encryptedData, passphrase);
  },

  /**
   * Submits a report hash + ZK proof to the SpeakSafeRegistry smart contract.
   * Requires a connected ethers.js Signer (from WalletConnect).
   *
   * TODO: populate CONTRACT_ADDRESS from environment once deployed.
   */
  storeReportHash: async (reportHash: string, proof: any = null, signer?: any): Promise<void> => {
    const contractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';
    if (!contractAddress) {
      console.warn('Registry address is not set — skipping on-chain storage.');
      return;
    }
    if (!signer) {
      console.warn('No signer provided — skipping on-chain storage.');
      return;
    }

    // Minimal ABI for the submitReport function — expand once contract is finalised.
    const abi = [
      'function submitReport(bytes32 reportHash, bytes calldata zkProof) external'
    ];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const proofBytes = proof ? ethers.utils.toUtf8Bytes(JSON.stringify(proof)) : '0x';
    const tx = await contract.submitReport(reportHash, proofBytes);
    await tx.wait();
    console.log('Report stored on-chain. Tx hash:', tx.hash);
  }
};

export default web3Service;
