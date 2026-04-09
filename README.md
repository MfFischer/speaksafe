# 🛡️ SpeakSafe Network v2.0

[![Domain: speaksafe.network](https://img.shields.io/badge/Domain-speaksafe.network-blue.svg)](https://speaksafe.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: Locked](https://img.shields.io/badge/Privacy-No_IP_Logging-green.svg)](#privacy-architecture)
[![Stack: Web3](https://img.shields.io/badge/Stack-React_|_Node_|_Polygon_|_IPFS-gray.svg)](#-technology-stack)

> **"A decentralized infrastructure for the truth."**  
> SpeakSafe is an anonymous, blockchain-secured whistleblowing platform designed to protect journalists, whistleblowers, and activists from retaliation while ensuring report integrity.

![SpeakSafe Hero](frontend/public/images/anonymous_whisperer.png)

## 🌐 **Live Platform**
Access the decentralized reporting interface:  
👉 **[https://speaksafe.network](https://speaksafe.network)**

---

## 🔒 **Privacy & Anonymity Architecture**

SpeakSafe follows a **Zero-Knowledge, Zero-Trails** philosophy.

- **Non-Custodial Identity**: No email, name, or phone number required. Connect via [Reown/WalletConnect](https://reown.com) or submit completely anonymously.
- **No Metadata Trails**: 
    - **Backend Privacy**: Node.js logs are stripped of all requester IP addresses.
    - **Nginx Stealth**: Access logging is disabled on the production VPS to prevent traffic metadata storage.
- **ZKP Integration**: leveraging **Zero-Knowledge Proofs** (zk-SNARKs) to verify reporting eligibility without leaking identity.
- **Immutable Evidence**: All documents are cryptographically hashed and stored on **IPFS**, with hashes anchored to the **Polygon** blockchain.

## 🚀 **Key Features**

- **Anonymous Reporting**: Submit sensitive evidence without revealing your identity.
- **Immutable Record Keeping**: Cryptographic proofs ensure that reports cannot be tampered with or deleted by centralized authorities.
- **DAO Governance**: Community-driven oversight and report escalation managed by decentralized voting.
- **Gas-less Sponsorship**: A built-in sponsorship system allows the community to cover the blockchain gas fees for whistleblowers in need.

## 🛠️ **Technology Stack**

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Premium Dark/Ash Aesthetic)
- **Web3**: Reown (WalletConnect v3) + Wagmi + Viem
- **Animations**: Framer Motion

### Backend & Infrastructure
- **Core**: Node.js + Express
- **Database**: PostgreSQL (Prisma ORM)
- **Caching**: Redis v7
- **Storage**: IPFS (Decentralized Content-Addressing)
- **Containerization**: Docker & Docker Compose

## 📦 **Quick Start (Self-Hosting)**

SpeakSafe is designed for rapid deployment on any Ubuntu-based VPS.

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local builds)

### 2. Local Setup
```bash
git clone https://github.com/MfFischer/speaksafe.git
cd speaksafe
```

### 3. Production Deployment
The production stack is pre-configured in `docker-compose.vps.yml`.

```bash
# Build and start the unified stack
docker compose -f docker-compose.vps.yml up -d
```

## 📈 **Project Roadmap**
- [x] **v1.0**: Core Smart Contracts & Proto-UI
- [x] **v2.0**: Premium Rebranding, Unified VPS Deployment, Privacy Hardening (No IP Logs)
- [ ] **v2.1**: ZK-Proof Circuit Optimizations
- [ ] **v3.0**: Mobile-Native Anonymous App

## 🤝 **Contact & Support**
SpeakSafe is built for the global community. For grants, partnerships, or technical inquiries:
- **Email**: afefischer@gmail.com
- **Website**: [speaksafe.network](https://speaksafe.network)

---
*SpeakSafe - Democratizing truth in an age of centralized control.*
