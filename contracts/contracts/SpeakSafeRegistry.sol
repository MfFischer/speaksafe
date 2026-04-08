// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SpeakSafeRegistry
 * @dev Core contract for managing anonymous reports with zero-knowledge proofs
 * @author SpeakSafe Team
 */
contract SpeakSafeRegistry is 
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuard
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Roles
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

    // Report status enumeration
    enum ReportStatus {
        Submitted,
        UnderReview,
        Verified,
        Investigating,
        Escalated,
        Resolved,
        Rejected,
        Archived
    }

    // Report category enumeration
    enum ReportCategory {
        Corruption,
        Fraud,
        Misconduct,
        SafetyViolation,
        Environmental,
        HumanRights,
        FinancialCrime,
        Other
    }

    // Report severity enumeration
    enum ReportSeverity {
        Low,
        Medium,
        High,
        Critical
    }

    // Report structure
    struct Report {
        bytes32 reportId;
        bytes32 anonymousId; // ZK-proof generated anonymous ID
        string ipfsHash; // Encrypted content stored on IPFS
        ReportCategory category;
        ReportSeverity severity;
        ReportStatus status;
        uint256 timestamp;
        uint256 lastUpdated;
        bytes32 locationHash; // Hashed location data
        bytes32 organizationHash; // Hashed organization data
        uint256 estimatedImpact; // Financial impact in wei
        bool hasEvidence;
        bytes zkProof; // Zero-knowledge proof
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 totalVotes;
        address assignedTo;
        bool isEscalated;
        uint256 escalatedAt;
    }

    // Mappings
    mapping(bytes32 => Report) public reports;
    mapping(bytes32 => bool) public usedAnonymousIds;
    mapping(address => uint256) public userReportCount;
    mapping(bytes32 => mapping(address => bool)) public hasVoted;
    mapping(bytes32 => string) public reportResolutions;

    // Arrays for enumeration
    bytes32[] public reportIds;
    mapping(ReportCategory => bytes32[]) public reportsByCategory;
    mapping(ReportStatus => bytes32[]) public reportsByStatus;

    // Events
    event ReportSubmitted(
        bytes32 indexed reportId,
        bytes32 indexed anonymousId,
        ReportCategory category,
        ReportSeverity severity,
        uint256 timestamp
    );

    event ReportStatusUpdated(
        bytes32 indexed reportId,
        ReportStatus oldStatus,
        ReportStatus newStatus,
        address updatedBy,
        uint256 timestamp
    );

    event ReportVoted(
        bytes32 indexed reportId,
        address indexed voter,
        bool support,
        uint256 timestamp
    );

    event ReportEscalated(
        bytes32 indexed reportId,
        address escalatedBy,
        uint256 timestamp
    );

    event ReportResolved(
        bytes32 indexed reportId,
        string resolution,
        address resolvedBy,
        uint256 timestamp
    );

    // Custom errors
    error InvalidReportId();
    error ReportAlreadyExists();
    error AnonymousIdAlreadyUsed();
    error InvalidZKProof();
    error AlreadyVoted();
    error UnauthorizedAccess();
    error InvalidStatus();
    error ReportNotFound();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract
     * @param _admin Address of the admin
     */
    function initialize(address _admin) public initializer {
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MODERATOR_ROLE, _admin);
        _grantRole(VERIFIER_ROLE, _admin);
    }

    /**
     * @dev Submit a new anonymous report
     * @param _reportId Unique report identifier
     * @param _anonymousId Anonymous identifier from ZK proof
     * @param _ipfsHash IPFS hash of encrypted report content
     * @param _category Report category
     * @param _severity Report severity
     * @param _locationHash Hashed location data
     * @param _organizationHash Hashed organization data
     * @param _estimatedImpact Estimated financial impact
     * @param _hasEvidence Whether report includes evidence
     * @param _zkProof Zero-knowledge proof
     */
    function submitReport(
        bytes32 _reportId,
        bytes32 _anonymousId,
        string calldata _ipfsHash,
        ReportCategory _category,
        ReportSeverity _severity,
        bytes32 _locationHash,
        bytes32 _organizationHash,
        uint256 _estimatedImpact,
        bool _hasEvidence,
        bytes calldata _zkProof
    ) external whenNotPaused nonReentrant {
        if (reports[_reportId].reportId != bytes32(0)) {
            revert ReportAlreadyExists();
        }

        if (usedAnonymousIds[_anonymousId]) {
            revert AnonymousIdAlreadyUsed();
        }

        // Verify zero-knowledge proof (simplified for demo)
        if (!_verifyZKProof(_zkProof, _anonymousId)) {
            revert InvalidZKProof();
        }

        // Create new report
        Report memory newReport = Report({
            reportId: _reportId,
            anonymousId: _anonymousId,
            ipfsHash: _ipfsHash,
            category: _category,
            severity: _severity,
            status: ReportStatus.Submitted,
            timestamp: block.timestamp,
            lastUpdated: block.timestamp,
            locationHash: _locationHash,
            organizationHash: _organizationHash,
            estimatedImpact: _estimatedImpact,
            hasEvidence: _hasEvidence,
            zkProof: _zkProof,
            votesFor: 0,
            votesAgainst: 0,
            totalVotes: 0,
            assignedTo: address(0),
            isEscalated: false,
            escalatedAt: 0
        });

        // Store report
        reports[_reportId] = newReport;
        usedAnonymousIds[_anonymousId] = true;
        reportIds.push(_reportId);
        reportsByCategory[_category].push(_reportId);
        reportsByStatus[ReportStatus.Submitted].push(_reportId);

        // Update user stats (if not anonymous)
        if (msg.sender != address(0)) {
            userReportCount[msg.sender]++;
        }

        emit ReportSubmitted(
            _reportId,
            _anonymousId,
            _category,
            _severity,
            block.timestamp
        );
    }

    /**
     * @dev Vote on a report (DAO governance)
     * @param _reportId Report to vote on
     * @param _support True for support, false for against
     */
    function voteOnReport(
        bytes32 _reportId,
        bool _support
    ) external whenNotPaused {
        if (reports[_reportId].reportId == bytes32(0)) {
            revert ReportNotFound();
        }

        if (hasVoted[_reportId][msg.sender]) {
            revert AlreadyVoted();
        }

        hasVoted[_reportId][msg.sender] = true;
        reports[_reportId].totalVotes++;

        if (_support) {
            reports[_reportId].votesFor++;
        } else {
            reports[_reportId].votesAgainst++;
        }

        reports[_reportId].lastUpdated = block.timestamp;

        emit ReportVoted(_reportId, msg.sender, _support, block.timestamp);
    }

    /**
     * @dev Update report status (moderators only)
     * @param _reportId Report to update
     * @param _newStatus New status
     */
    function updateReportStatus(
        bytes32 _reportId,
        ReportStatus _newStatus
    ) external onlyRole(MODERATOR_ROLE) whenNotPaused {
        if (reports[_reportId].reportId == bytes32(0)) {
            revert ReportNotFound();
        }

        ReportStatus oldStatus = reports[_reportId].status;
        reports[_reportId].status = _newStatus;
        reports[_reportId].lastUpdated = block.timestamp;

        // Update status arrays
        _removeFromStatusArray(oldStatus, _reportId);
        reportsByStatus[_newStatus].push(_reportId);

        emit ReportStatusUpdated(
            _reportId,
            oldStatus,
            _newStatus,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Escalate a report to higher authorities
     * @param _reportId Report to escalate
     */
    function escalateReport(
        bytes32 _reportId
    ) external onlyRole(MODERATOR_ROLE) whenNotPaused {
        if (reports[_reportId].reportId == bytes32(0)) {
            revert ReportNotFound();
        }

        reports[_reportId].isEscalated = true;
        reports[_reportId].escalatedAt = block.timestamp;
        reports[_reportId].status = ReportStatus.Escalated;
        reports[_reportId].lastUpdated = block.timestamp;

        emit ReportEscalated(_reportId, msg.sender, block.timestamp);
    }

    /**
     * @dev Resolve a report with resolution details
     * @param _reportId Report to resolve
     * @param _resolution Resolution description
     */
    function resolveReport(
        bytes32 _reportId,
        string calldata _resolution
    ) external onlyRole(MODERATOR_ROLE) whenNotPaused {
        if (reports[_reportId].reportId == bytes32(0)) {
            revert ReportNotFound();
        }

        reports[_reportId].status = ReportStatus.Resolved;
        reports[_reportId].lastUpdated = block.timestamp;
        reportResolutions[_reportId] = _resolution;

        emit ReportResolved(_reportId, _resolution, msg.sender, block.timestamp);
    }

    /**
     * @dev Get report details
     * @param _reportId Report identifier
     * @return Report struct
     */
    function getReport(bytes32 _reportId) external view returns (Report memory) {
        if (reports[_reportId].reportId == bytes32(0)) {
            revert ReportNotFound();
        }
        return reports[_reportId];
    }

    /**
     * @dev Get total number of reports
     * @return Total count
     */
    function getTotalReports() external view returns (uint256) {
        return reportIds.length;
    }

    /**
     * @dev Get reports by category
     * @param _category Category to filter by
     * @return Array of report IDs
     */
    function getReportsByCategory(
        ReportCategory _category
    ) external view returns (bytes32[] memory) {
        return reportsByCategory[_category];
    }

    /**
     * @dev Get reports by status
     * @param _status Status to filter by
     * @return Array of report IDs
     */
    function getReportsByStatus(
        ReportStatus _status
    ) external view returns (bytes32[] memory) {
        return reportsByStatus[_status];
    }

    /**
     * @dev Verify zero-knowledge proof (simplified implementation)
     * @param _proof ZK proof bytes
     * @param _anonymousId Anonymous identifier
     * @return True if proof is valid
     */
    function _verifyZKProof(
        bytes calldata _proof,
        bytes32 _anonymousId
    ) internal pure returns (bool) {
        // Simplified verification - in production, use proper ZK verification
        // This would integrate with circom/snarkjs for actual ZK proof verification
        return _proof.length > 0 && _anonymousId != bytes32(0);
    }

    /**
     * @dev Remove report from status array
     * @param _status Status array to remove from
     * @param _reportId Report ID to remove
     */
    function _removeFromStatusArray(
        ReportStatus _status,
        bytes32 _reportId
    ) internal {
        bytes32[] storage statusArray = reportsByStatus[_status];
        for (uint256 i = 0; i < statusArray.length; i++) {
            if (statusArray[i] == _reportId) {
                statusArray[i] = statusArray[statusArray.length - 1];
                statusArray.pop();
                break;
            }
        }
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
}
