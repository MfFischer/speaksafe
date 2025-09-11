speaksafe-project/
├── contracts/                        # Polygon smart contracts (unchanged)
│   ├── anonymityManager.sol         # Zk-SNARKs for anonymity
│   ├── reportRegistry.sol           # Stores report hashes
│   ├── daoGovernance.sol            # DAO voting and staking
│   ├── rewardDistributor.sol        # Manages token rewards
│   ├── secureChannel.sol            # Encrypted communication keys
│   ├── dataDeletionRequest.sol      # GDPR-compliant erasure requests
│
├── amplify/                          # Amplify config for frontend hosting
│   ├── amplify.yml                  # Build settings for React frontend
│   └── backend-config.json          # Minimal config (no AWS backend services)
│
├── backend/                          # Node.js backend for Hostinger VPS
│   ├── config/
│   │   ├── dbConfig.js             # MySQL connection settings
│   │   ├── envConfig.js            # Environment variables (e.g., VPS_IP, PORT)
│   │   └── storageConfig.js        # Config for local storage or Hostinger Object Storage
│   ├── controllers/
│   │   ├── reportController.js     # CRUD for reports (create, read, delete)
│   │   ├── authController.js       # JWT-based authentication
│   │   └── complianceController.js # GDPR deletion and consent logic
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verifies JWT tokens
│   │   └── encryptionMiddleware.js # Encrypts/decrypts report data
│   ├── services/
│   │   ├── dbService.js            # MySQL query wrappers (e.g., insertReport)
│   │   ├── storageService.js       # Manages file storage (local or cloud)
│   │   ├── aiService.js            # Optional AI analysis (e.g., TensorFlow.js)
│   │   └── blockchainService.js    # Interacts with Polygon contracts (optional)
│   ├── routes/
│   │   ├── apiRoutes.js            # REST endpoints (/reports, /auth, /compliance)
│   │   └── wsRoutes.js             # WebSocket endpoints (e.g., real-time updates)
│   ├── db/
│   │   └── schema.sql              # MySQL schema (tables: reports, users)
│   └── server.js                   # Express server entry point with WebSocket support
│
├── frontend/                         # React web app (Amplify-hosted)
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.png            # SpeakSafe logo
│   │   │   └── styles.css          # Global styles
│   │   ├── components/
│   │   │   ├── reportForm.tsx      # Report submission form
│   │   │   ├── dashboard.tsx       # Real-time dashboard
│   │   │   ├── eduModal.tsx        # Educational content
│   │   │   ├── privacyConsentModal.tsx # GDPR consent popup
│   │   │   ├── cookieConsentModal.tsx # Cookie consent popup
│   │   │   └── legalDisclaimer.tsx # Legal notices
│   │   ├── pages/
│   │   │   ├── homePage.tsx        # Landing page
│   │   │   ├── reportPage.tsx      # Report submission UI
│   │   │   ├── daoPage.tsx         # DAO governance UI
│   │   │   └── settingsPage.tsx    # Privacy/language settings
│   │   ├── services/
│   │   │   ├── apiService.ts       # Calls VPS REST API (axios)
│   │   │   ├── web3Service.ts      # MetaMask SDK for Polygon
│   │   │   ├── zkpService.ts       # ZK-SNARK proof generation
│   │   │   └── complianceService.ts # GDPR/cookie logic
│   │   └── App.tsx                 # Main app component
│   ├── public/
│   │   ├── index.html              # Web entry point
│   │   └── favicon.ico             # Site icon
│   └── package.json                # Dependencies (axios, @metamask/sdk, etc.)
│
├── mobile/                           # React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── reportScreen.tsx    # Offline report drafting
│   │   │   ├── settingsScreen.tsx  # Privacy/language settings
│   │   │   └── daoScreen.tsx       # Mobile DAO UI
│   │   ├── components/
│   │   │   ├── privacyConsent.tsx  # GDPR consent for mobile
│   │   │   └── offlineSync.tsx     # Syncs offline reports
│   │   └── utils/
│   │       ├── apiUtil.ts          # VPS API calls for mobile
│   │       ├── syncUtil.ts         # Offline-to-online sync logic
│   │       └── encryptionUtil.ts   # Local encryption for reports
│   └── App.tsx                     # Main mobile app entry
│
├── scripts/                          # Automation scripts
│   ├── deployContracts.js           # Deploys Polygon contracts
│   ├── deployVps.js                # Deploys backend to Hostinger VPS (e.g., via SSH)
│   ├── setupAmplify.js              # Configures Amplify hosting
│   └── seedData.js                 # Seeds MySQL with test data
│
├── tests/                            # Unit and integration tests
│   ├── backendTests/
│   │   ├── reportController.test.js # Tests report API
│   │   ├── authController.test.js   # Tests authentication
│   │   └── dbService.test.js        # Tests MySQL queries
│   ├── frontendTests/
│   │   ├── apiService.test.ts       # Tests VPS API integration
│   │   └── reportForm.test.tsx      # Tests report UI
│   └── mobileTests/
│       └── reportScreen.test.tsx    # Tests mobile reporting
│
├── docs/                             # Documentation
│   ├── architecture.md              # Amplify + VPS + MySQL architecture
│   ├── apiDocs.md                   # VPS REST API endpoints
│   ├── userGuide.md                 # User instructions
│   ├── complianceGuide.md           # GDPR and privacy policies
│   └── developerGuide.md            # VPS setup and contribution guide
│
├── legal/                            # Legal files (unchanged)
│   ├── privacyPolicy.md             # GDPR-compliant privacy policy
│   ├── termsOfService.md            # Terms of use
│   └── cookiePolicy.md              # Cookie usage details
│
└── README.md                         # Project overview and setup instructions