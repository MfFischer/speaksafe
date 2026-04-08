// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SpeakSafeTreasury
 * @dev Treasury contract for managing donations and sponsoring anonymous reports
 * @author SpeakSafe Team
 */
contract SpeakSafeTreasury is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    bytes32 public constant SPONSOR_ROLE = keccak256("SPONSOR_ROLE");

    // Donation tiers
    enum DonationTier {
        Supporter,    // 1-10 MATIC
        Advocate,     // 11-50 MATIC
        Guardian,     // 51-100 MATIC
        Champion      // 100+ MATIC
    }

    // Donation purpose
    enum DonationPurpose {
        GeneralFund,
        ReportSponsorship,
        PlatformDevelopment,
        LegalSupport,
        CommunityRewards,
        Infrastructure
    }

    // Donation structure
    struct Donation {
        address donor;
        uint256 amount;
        address token; // address(0) for native MATIC
        DonationTier tier;
        DonationPurpose purpose;
        bytes32 sponsoredReportId; // For report sponsorship
        uint256 timestamp;
        bool isRecurring;
        uint256 recurringInterval; // in seconds
        uint256 nextDonationTime;
        bool isActive;
        string message;
        bool isAnonymous;
    }

    // Sponsorship pool structure
    struct SponsorshipPool {
        uint256 totalAmount;
        uint256 availableAmount;
        uint256 reportsSponsored;
        uint256 costPerReport;
        mapping(bytes32 => bool) sponsoredReports;
    }

    // Treasury allocation structure
    struct TreasuryAllocation {
        DonationPurpose purpose;
        uint256 percentage; // Basis points (10000 = 100%)
        uint256 totalAllocated;
        uint256 totalSpent;
    }

    // State variables
    mapping(uint256 => Donation) public donations;
    mapping(address => uint256[]) public donorDonations;
    mapping(address => DonationTier) public donorTiers;
    mapping(address => uint256) public donorTotalContributions;
    mapping(address => bool) public supportedTokens;
    mapping(DonationPurpose => TreasuryAllocation) public treasuryAllocations;
    
    SponsorshipPool public sponsorshipPool;
    
    uint256 public donationCounter;
    uint256 public totalDonationsReceived;
    uint256 public totalReportsSponsored;
    uint256 public reportSponsorshipCost; // Cost to sponsor one report
    
    // Arrays for enumeration
    address[] public donors;
    address[] public supportedTokensList;

    // Events
    event DonationReceived(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        address token,
        DonationTier tier,
        DonationPurpose purpose,
        bool isAnonymous
    );

    event ReportSponsored(
        bytes32 indexed reportId,
        address indexed sponsor,
        uint256 amount,
        uint256 timestamp
    );

    event RecurringDonationProcessed(
        uint256 indexed donationId,
        address indexed donor,
        uint256 amount,
        uint256 nextDonationTime
    );

    event TreasuryAllocationUpdated(
        DonationPurpose purpose,
        uint256 oldPercentage,
        uint256 newPercentage
    );

    event FundsWithdrawn(
        address indexed recipient,
        uint256 amount,
        address token,
        DonationPurpose purpose
    );

    // Custom errors
    error InsufficientFunds();
    error InvalidDonationAmount();
    error UnsupportedToken();
    error ReportAlreadySponsored();
    error InvalidAllocationPercentage();
    error UnauthorizedWithdrawal();
    error RecurringDonationNotDue();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the treasury
     * @param _admin Admin address
     * @param _reportSponsorshipCost Cost to sponsor one report
     */
    function initialize(
        address _admin,
        uint256 _reportSponsorshipCost
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(TREASURER_ROLE, _admin);

        reportSponsorshipCost = _reportSponsorshipCost;

        // Initialize default treasury allocations
        treasuryAllocations[DonationPurpose.GeneralFund] = TreasuryAllocation({
            purpose: DonationPurpose.GeneralFund,
            percentage: 3000, // 30%
            totalAllocated: 0,
            totalSpent: 0
        });

        treasuryAllocations[DonationPurpose.ReportSponsorship] = TreasuryAllocation({
            purpose: DonationPurpose.ReportSponsorship,
            percentage: 4000, // 40%
            totalAllocated: 0,
            totalSpent: 0
        });

        treasuryAllocations[DonationPurpose.PlatformDevelopment] = TreasuryAllocation({
            purpose: DonationPurpose.PlatformDevelopment,
            percentage: 2000, // 20%
            totalAllocated: 0,
            totalSpent: 0
        });

        treasuryAllocations[DonationPurpose.LegalSupport] = TreasuryAllocation({
            purpose: DonationPurpose.LegalSupport,
            percentage: 500, // 5%
            totalAllocated: 0,
            totalSpent: 0
        });

        treasuryAllocations[DonationPurpose.CommunityRewards] = TreasuryAllocation({
            purpose: DonationPurpose.CommunityRewards,
            percentage: 300, // 3%
            totalAllocated: 0,
            totalSpent: 0
        });

        treasuryAllocations[DonationPurpose.Infrastructure] = TreasuryAllocation({
            purpose: DonationPurpose.Infrastructure,
            percentage: 200, // 2%
            totalAllocated: 0,
            totalSpent: 0
        });

        // Add native MATIC support
        supportedTokens[address(0)] = true;
        supportedTokensList.push(address(0));
    }

    /**
     * @dev Donate native MATIC to the treasury
     * @param _purpose Purpose of the donation
     * @param _sponsoredReportId Report to sponsor (if applicable)
     * @param _message Optional message from donor
     * @param _isAnonymous Whether donation should be anonymous
     * @param _isRecurring Whether this is a recurring donation
     * @param _recurringInterval Interval for recurring donations (in seconds)
     */
    function donate(
        DonationPurpose _purpose,
        bytes32 _sponsoredReportId,
        string calldata _message,
        bool _isAnonymous,
        bool _isRecurring,
        uint256 _recurringInterval
    ) external payable whenNotPaused nonReentrant {
        if (msg.value == 0) {
            revert InvalidDonationAmount();
        }

        _processDonation(
            msg.sender,
            msg.value,
            address(0),
            _purpose,
            _sponsoredReportId,
            _message,
            _isAnonymous,
            _isRecurring,
            _recurringInterval
        );
    }

    /**
     * @dev Donate ERC20 tokens to the treasury
     * @param _token Token contract address
     * @param _amount Amount to donate
     * @param _purpose Purpose of the donation
     * @param _sponsoredReportId Report to sponsor (if applicable)
     * @param _message Optional message from donor
     * @param _isAnonymous Whether donation should be anonymous
     * @param _isRecurring Whether this is a recurring donation
     * @param _recurringInterval Interval for recurring donations (in seconds)
     */
    function donateToken(
        address _token,
        uint256 _amount,
        DonationPurpose _purpose,
        bytes32 _sponsoredReportId,
        string calldata _message,
        bool _isAnonymous,
        bool _isRecurring,
        uint256 _recurringInterval
    ) external whenNotPaused nonReentrant {
        if (!supportedTokens[_token]) {
            revert UnsupportedToken();
        }

        if (_amount == 0) {
            revert InvalidDonationAmount();
        }

        // Transfer tokens from donor
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        _processDonation(
            msg.sender,
            _amount,
            _token,
            _purpose,
            _sponsoredReportId,
            _message,
            _isAnonymous,
            _isRecurring,
            _recurringInterval
        );
    }

    /**
     * @dev Process recurring donation
     * @param _donationId Donation ID to process
     */
    function processRecurringDonation(
        uint256 _donationId
    ) external whenNotPaused nonReentrant {
        Donation storage donation = donations[_donationId];
        
        if (!donation.isRecurring || !donation.isActive) {
            revert RecurringDonationNotDue();
        }

        if (block.timestamp < donation.nextDonationTime) {
            revert RecurringDonationNotDue();
        }

        // Process the recurring donation
        if (donation.token == address(0)) {
            // Native MATIC - would need to be pre-funded or use a different mechanism
            revert InsufficientFunds();
        } else {
            // ERC20 token
            IERC20(donation.token).safeTransferFrom(
                donation.donor,
                address(this),
                donation.amount
            );
        }

        // Update next donation time
        donation.nextDonationTime = block.timestamp + donation.recurringInterval;

        // Allocate funds
        _allocateFunds(donation.amount, donation.purpose);

        emit RecurringDonationProcessed(
            _donationId,
            donation.donor,
            donation.amount,
            donation.nextDonationTime
        );
    }

    /**
     * @dev Sponsor a specific report
     * @param _reportId Report to sponsor
     */
    function sponsorReport(bytes32 _reportId) external payable whenNotPaused nonReentrant {
        if (msg.value < reportSponsorshipCost) {
            revert InsufficientFunds();
        }

        if (sponsorshipPool.sponsoredReports[_reportId]) {
            revert ReportAlreadySponsored();
        }

        // Mark report as sponsored
        sponsorshipPool.sponsoredReports[_reportId] = true;
        sponsorshipPool.reportsSponsored++;
        totalReportsSponsored++;

        // Add to sponsorship pool
        sponsorshipPool.totalAmount += msg.value;
        sponsorshipPool.availableAmount += msg.value;

        emit ReportSponsored(_reportId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Internal function to process donations
     */
    function _processDonation(
        address _donor,
        uint256 _amount,
        address _token,
        DonationPurpose _purpose,
        bytes32 _sponsoredReportId,
        string memory _message,
        bool _isAnonymous,
        bool _isRecurring,
        uint256 _recurringInterval
    ) internal {
        donationCounter++;
        
        // Determine donation tier
        DonationTier tier = _getDonationTier(_amount, _token);
        
        // Create donation record
        donations[donationCounter] = Donation({
            donor: _donor,
            amount: _amount,
            token: _token,
            tier: tier,
            purpose: _purpose,
            sponsoredReportId: _sponsoredReportId,
            timestamp: block.timestamp,
            isRecurring: _isRecurring,
            recurringInterval: _recurringInterval,
            nextDonationTime: _isRecurring ? block.timestamp + _recurringInterval : 0,
            isActive: true,
            message: _message,
            isAnonymous: _isAnonymous
        });

        // Update donor records
        if (donorDonations[_donor].length == 0) {
            donors.push(_donor);
        }
        donorDonations[_donor].push(donationCounter);
        donorTotalContributions[_donor] += _amount;
        donorTiers[_donor] = tier;

        // Update totals
        totalDonationsReceived += _amount;

        // Allocate funds to purposes
        _allocateFunds(_amount, _purpose);

        emit DonationReceived(
            donationCounter,
            _isAnonymous ? address(0) : _donor,
            _amount,
            _token,
            tier,
            _purpose,
            _isAnonymous
        );
    }

    /**
     * @dev Determine donation tier based on amount
     * @param _amount Donation amount
     * @param _token Token address
     * @return DonationTier
     */
    function _getDonationTier(
        uint256 _amount,
        address _token
    ) internal pure returns (DonationTier) {
        // Simplified tier calculation for MATIC (assuming 18 decimals)
        if (_token == address(0)) {
            if (_amount >= 100 ether) return DonationTier.Champion;
            if (_amount >= 51 ether) return DonationTier.Guardian;
            if (_amount >= 11 ether) return DonationTier.Advocate;
            return DonationTier.Supporter;
        }
        
        // For other tokens, use similar logic based on token decimals
        return DonationTier.Supporter;
    }

    /**
     * @dev Allocate funds to different purposes
     * @param _amount Amount to allocate
     * @param _purpose Primary purpose
     */
    function _allocateFunds(uint256 _amount, DonationPurpose _purpose) internal {
        TreasuryAllocation storage allocation = treasuryAllocations[_purpose];
        allocation.totalAllocated += _amount;
    }

    /**
     * @dev Get donation details
     * @param _donationId Donation ID
     * @return Donation struct
     */
    function getDonation(uint256 _donationId) external view returns (Donation memory) {
        return donations[_donationId];
    }

    /**
     * @dev Get donor's donations
     * @param _donor Donor address
     * @return Array of donation IDs
     */
    function getDonorDonations(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }

    /**
     * @dev Get treasury balance for a specific token
     * @param _token Token address (address(0) for native)
     * @return Balance
     */
    function getTreasuryBalance(address _token) external view returns (uint256) {
        if (_token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(_token).balanceOf(address(this));
        }
    }

    /**
     * @dev Add supported token (admin only)
     * @param _token Token address
     */
    function addSupportedToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!supportedTokens[_token]) {
            supportedTokens[_token] = true;
            supportedTokensList.push(_token);
        }
    }

    /**
     * @dev Withdraw funds for approved purposes (treasurer only)
     * @param _recipient Recipient address
     * @param _amount Amount to withdraw
     * @param _token Token address
     * @param _purpose Purpose of withdrawal
     */
    function withdrawFunds(
        address _recipient,
        uint256 _amount,
        address _token,
        DonationPurpose _purpose
    ) external onlyRole(TREASURER_ROLE) whenNotPaused nonReentrant {
        TreasuryAllocation storage allocation = treasuryAllocations[_purpose];
        
        if (allocation.totalAllocated - allocation.totalSpent < _amount) {
            revert InsufficientFunds();
        }

        allocation.totalSpent += _amount;

        if (_token == address(0)) {
            payable(_recipient).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_recipient, _amount);
        }

        emit FundsWithdrawn(_recipient, _amount, _token, _purpose);
    }

    /**
     * @dev Pause contract (admin only)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract (admin only)
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Receive function to accept native MATIC donations
     */
    receive() external payable {
        // Simple donation to general fund
        _processDonation(
            msg.sender,
            msg.value,
            address(0),
            DonationPurpose.GeneralFund,
            bytes32(0),
            "",
            false,
            false,
            0
        );
    }
}
