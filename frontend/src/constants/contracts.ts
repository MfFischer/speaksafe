export const CONTRACT_ADDRESSES = {
  registry: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  treasury: '0x9A676e781A523b5d0C0e43731313A708CB607508',
  token: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
  dao: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
} as const;

export const DAO_ABI = [
  {
    "inputs": [],
    "name": "getDAOStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalProposals", "type": "uint256" },
      { "internalType": "uint256", "name": "totalMembers", "type": "uint256" },
      { "internalType": "uint256", "name": "totalVotesCast", "type": "uint256" },
      { "internalType": "uint256", "name": "treasuryBalance", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
    ],
    "name": "state",
    "outputs": [
      { "internalType": "uint8", "name": "", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "internalType": "uint8", "name": "support", "type": "uint8" }
    ],
    "name": "castVote",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "proposalId", "type": "uint256" }
    ],
    "name": "proposalMetadata",
    "outputs": [
      { "internalType": "enum SpeakSafeDAO.ProposalType", "name": "proposalType", "type": "uint8" },
      { "internalType": "bytes32", "name": "relatedReportId", "type": "bytes32" },
      { "internalType": "uint256", "name": "requestedAmount", "type": "uint256" },
      { "internalType": "address", "name": "targetAddress", "type": "address" },
      { "internalType": "string", "name": "justification", "type": "string" },
      { "internalType": "uint256", "name": "urgencyLevel", "type": "uint256" },
      { "internalType": "bool", "name": "isEmergency", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalProposals",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "proposer", "type": "address" },
      { "indexed": false, "internalType": "address[]", "name": "targets", "type": "address[]" },
      { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" },
      { "indexed": false, "internalType": "string[]", "name": "signatures", "type": "string[]" },
      { "indexed": false, "internalType": "bytes[]", "name": "calldatas", "type": "bytes[]" },
      { "indexed": false, "internalType": "uint256", "name": "voteStart", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "voteEnd", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "description", "type": "string" }
    ],
    "name": "ProposalCreated",
    "type": "event"
  }
] as const;

export const TREASURY_ABI = [
  {
    "inputs": [
      { "internalType": "uint8", "name": "_purpose", "type": "uint8" },
      { "internalType": "bytes32", "name": "_sponsoredReportId", "type": "bytes32" },
      { "internalType": "string", "name": "_message", "type": "string" },
      { "internalType": "bool", "name": "_isAnonymous", "type": "bool" },
      { "internalType": "bool", "name": "_isRecurring", "type": "bool" },
      { "internalType": "uint256", "name": "_recurringInterval", "type": "uint256" }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

export const TOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "delegatee", "type": "address" }
    ],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "delegates",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
