import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

async function main() {
  console.log("🚀 Starting SpeakSafe Smart Contract Deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MATIC\n");

  // Deploy SpeakSafe Registry
  console.log("📋 Deploying SpeakSafe Registry...");
  const SpeakSafeRegistry = await ethers.getContractFactory("SpeakSafeRegistry");
  const registry: any = await upgrades.deployProxy(
    SpeakSafeRegistry,
    [deployer.address],
    { 
      initializer: "initialize",
      unsafeAllow: ["constructor"]
    }
  );
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ SpeakSafe Registry deployed to:", registryAddress);

  // Deploy Treasury
  console.log("\n💰 Deploying SpeakSafe Treasury...");
  const reportSponsorshipCost = ethers.parseEther("1"); // 1 MATIC per report
  const SpeakSafeTreasury = await ethers.getContractFactory("SpeakSafeTreasury");
  const treasury: any = await upgrades.deployProxy(
    SpeakSafeTreasury,
    [deployer.address, reportSponsorshipCost],
    { 
      initializer: "initialize",
      unsafeAllow: ["constructor"]
    }
  );
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ SpeakSafe Treasury deployed to:", treasuryAddress);

  // Deploy Governance Token (simplified ERC20 for voting)
  console.log("\n🗳️  Deploying Governance Token...");
  const GovernanceToken = await ethers.getContractFactory("SpeakSafeToken");
  const token: any = await GovernanceToken.connect(deployer).deploy(
    "SpeakSafe Governance Token",
    "SPEAK",
    ethers.parseEther("1000000"), // 1M tokens
    deployer.address
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Governance Token deployed to:", tokenAddress);

  // Deploy Timelock Controller
  console.log("\n⏰ Deploying Timelock Controller...");
  const TimelockController = await ethers.getContractFactory("SpeakSafeTimelock");
  const minDelay = 24 * 60 * 60; // 24 hours
  const timelock: any = await TimelockController.deploy(
    minDelay,
    [deployer.address], // proposers
    [deployer.address], // executors
    deployer.address    // admin
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ Timelock Controller deployed to:", timelockAddress);

  // Deploy DAO
  console.log("\n🏛️  Deploying SpeakSafe DAO...");
  const SpeakSafeDAO = await ethers.getContractFactory("SpeakSafeDAO");
  const dao: any = await upgrades.deployProxy(
    SpeakSafeDAO,
    [tokenAddress, timelockAddress, deployer.address],
    { 
      initializer: "initialize",
      unsafeAllow: ["constructor"]
    }
  );
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("✅ SpeakSafe DAO deployed to:", daoAddress);

  // Setup roles and permissions
  console.log("\n🔐 Setting up roles and permissions...");
  
  // Grant DAO role to the DAO contract in Registry
  const DAO_ROLE = await registry.DAO_ROLE();
  await registry.grantRole(DAO_ROLE, daoAddress);
  console.log("✅ Granted DAO role to DAO contract in Registry");

  // Grant DAO role to the DAO contract in Treasury
  const TREASURY_DAO_ROLE = await treasury.DAO_ROLE();
  await treasury.grantRole(TREASURY_DAO_ROLE, daoAddress);
  console.log("✅ Granted DAO role to DAO contract in Treasury");

  // Setup timelock roles
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  
  await timelock.grantRole(PROPOSER_ROLE, daoAddress);
  await timelock.grantRole(EXECUTOR_ROLE, daoAddress);
  console.log("✅ Granted timelock roles to DAO contract");

  // Delegate voting power to deployer for initial governance
  await token.delegate(deployer.address);
  console.log("✅ Delegated voting power to deployer");

  // Verify deployments
  console.log("\n🔍 Verifying deployments...");
  
  try {
    // Test Registry
    const totalReports = await registry.getTotalReports();
    console.log("✅ Registry verification: Total reports =", totalReports.toString());

    // Test Treasury
    const treasuryBalance = await treasury.getTreasuryBalance(ethers.ZeroAddress);
    console.log("✅ Treasury verification: Balance =", ethers.formatEther(treasuryBalance), "MATIC");

    // Test Token
    const tokenSupply = await token.totalSupply();
    console.log("✅ Token verification: Total supply =", ethers.formatEther(tokenSupply), "SPEAK");

    // Test DAO
    const daoStats = await dao.getDAOStats();
    console.log("✅ DAO verification: Total proposals =", daoStats[0].toString());

  } catch (error) {
    console.error("❌ Verification failed:", error);
  }

  // Save deployment addresses
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      SpeakSafeRegistry: registryAddress,
      SpeakSafeTreasury: treasuryAddress,
      GovernanceToken: tokenAddress,
      TimelockController: timelockAddress,
      SpeakSafeDAO: daoAddress
    },
    deploymentTime: new Date().toISOString(),
    gasUsed: {
      // Gas tracking would be implemented here
    }
  };

  console.log("\n📄 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("Network:", deploymentInfo.network.name, `(Chain ID: ${deploymentInfo.network.chainId})`);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("\n📋 Contract Addresses:");
  console.log("SpeakSafe Registry:", deploymentInfo.contracts.SpeakSafeRegistry);
  console.log("SpeakSafe Treasury:", deploymentInfo.contracts.SpeakSafeTreasury);
  console.log("Governance Token:", deploymentInfo.contracts.GovernanceToken);
  console.log("Timelock Controller:", deploymentInfo.contracts.TimelockController);
  console.log("SpeakSafe DAO:", deploymentInfo.contracts.SpeakSafeDAO);
  console.log("\n⏰ Deployment Time:", deploymentInfo.deploymentTime);

  // Save to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const networkName = deploymentInfo.network.name;
  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next Steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test contract interactions");
  console.log("4. Setup monitoring and alerts");
  console.log("5. Prepare for mainnet deployment");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
