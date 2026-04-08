// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

/**
 * @title SpeakSafeDAO
 * @dev Decentralized Autonomous Organization for SpeakSafe governance
 * @author SpeakSafe Team
 */
contract SpeakSafeDAO is
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    GovernorTimelockControlUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    // Roles
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    // Proposal types
    enum ProposalType {
        ReportEscalation,
        PolicyChange,
        TreasuryAllocation,
        PlatformUpgrade,
        ModeratorAppointment,
        EmergencyAction
    }

    // Proposal metadata
    struct ProposalMetadata {
        ProposalType proposalType;
        bytes32 relatedReportId; // For report-related proposals
        uint256 requestedAmount; // For treasury proposals
        address targetAddress; // For appointments or upgrades
        string justification;
        uint256 urgencyLevel; // 1-5 scale
        bool isEmergency;
    }

    // Mappings
    mapping(uint256 => ProposalMetadata) public proposalMetadata;
    mapping(address => uint256) public memberContributions;
    mapping(address => uint256) public memberReputationScore;
    mapping(bytes32 => uint256) public reportProposals; // reportId => proposalId

    // DAO statistics
    uint256 public totalProposals;
    uint256 public totalMembers;
    uint256 public totalVotesCast;
    uint256 public treasuryBalance;

    // Events
    event ProposalCreatedWithMetadata(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        bytes32 relatedReportId,
        uint256 urgencyLevel
    );

    event MemberJoined(address indexed member, uint256 timestamp);
    event ReputationUpdated(address indexed member, uint256 oldScore, uint256 newScore);
    event EmergencyActionExecuted(uint256 indexed proposalId, address executor);

    // Custom errors
    error InsufficientReputation();
    error InvalidProposalType();
    error ReportAlreadyHasProposal();
    error EmergencyProposalRequired();
    error UnauthorizedEmergencyAction();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the DAO
     * @param _token Governance token contract
     * @param _timelock Timelock controller
     * @param _admin Admin address
     */
    function initialize(
        IVotes _token,
        TimelockControllerUpgradeable _timelock,
        address _admin
    ) public initializer {
        __Governor_init("SpeakSafeDAO");
        __GovernorSettings_init(
            7200, // 1 day voting delay (assuming 12s blocks)
            50400, // 1 week voting period
            1000e18 // 1000 tokens proposal threshold
        );
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(4); // 4% quorum
        __GovernorTimelockControl_init(_timelock);
        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(PROPOSER_ROLE, _admin);
        _grantRole(EXECUTOR_ROLE, address(_timelock));
        _grantRole(EMERGENCY_ROLE, _admin);
    }

    /**
     * @dev Create a proposal with metadata
     * @param targets Target addresses
     * @param values ETH values
     * @param calldatas Function call data
     * @param description Proposal description
     * @param proposalType Type of proposal
     * @param relatedReportId Related report (if applicable)
     * @param requestedAmount Requested amount (if applicable)
     * @param targetAddress Target address (if applicable)
     * @param justification Detailed justification
     * @param urgencyLevel Urgency level (1-5)
     * @param isEmergency Whether this is an emergency proposal
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        ProposalType proposalType,
        bytes32 relatedReportId,
        uint256 requestedAmount,
        address targetAddress,
        string memory justification,
        uint256 urgencyLevel,
        bool isEmergency
    ) public returns (uint256) {
        // Check reputation for non-emergency proposals
        if (!isEmergency && memberReputationScore[msg.sender] < 100) {
            revert InsufficientReputation();
        }

        // Emergency proposals require special role
        if (isEmergency && !hasRole(EMERGENCY_ROLE, msg.sender)) {
            revert UnauthorizedEmergencyAction();
        }

        // Check if report already has a proposal
        if (relatedReportId != bytes32(0) && reportProposals[relatedReportId] != 0) {
            revert ReportAlreadyHasProposal();
        }

        uint256 proposalId = propose(targets, values, calldatas, description);

        // Store metadata
        proposalMetadata[proposalId] = ProposalMetadata({
            proposalType: proposalType,
            relatedReportId: relatedReportId,
            requestedAmount: requestedAmount,
            targetAddress: targetAddress,
            justification: justification,
            urgencyLevel: urgencyLevel,
            isEmergency: isEmergency
        });

        // Link report to proposal
        if (relatedReportId != bytes32(0)) {
            reportProposals[relatedReportId] = proposalId;
        }

        totalProposals++;

        emit ProposalCreatedWithMetadata(
            proposalId,
            msg.sender,
            proposalType,
            relatedReportId,
            urgencyLevel
        );

        return proposalId;
    }

    /**
     * @dev Join the DAO as a member
     */
    function joinDAO() external {
        if (memberReputationScore[msg.sender] == 0) {
            memberReputationScore[msg.sender] = 50; // Starting reputation
            totalMembers++;
            emit MemberJoined(msg.sender, block.timestamp);
        }
    }

    /**
     * @dev Update member reputation (admin only)
     * @param member Member address
     * @param newScore New reputation score
     */
    function updateReputation(
        address member,
        uint256 newScore
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldScore = memberReputationScore[member];
        memberReputationScore[member] = newScore;
        emit ReputationUpdated(member, oldScore, newScore);
    }

    /**
     * @dev Execute emergency proposal immediately
     * @param proposalId Proposal to execute
     */
    function executeEmergencyProposal(
        uint256 proposalId
    ) external onlyRole(EMERGENCY_ROLE) {
        ProposalMetadata memory metadata = proposalMetadata[proposalId];
        
        if (!metadata.isEmergency) {
            revert EmergencyProposalRequired();
        }

        // Execute immediately without normal voting process
        _executeOperations(proposalId, new address[](0), new uint256[](0), new bytes[](0), bytes32(0));
        
        emit EmergencyActionExecuted(proposalId, msg.sender);
    }

    /**
     * @dev Get proposal metadata
     * @param proposalId Proposal ID
     * @return Proposal metadata
     */
    function getProposalMetadata(
        uint256 proposalId
    ) external view returns (ProposalMetadata memory) {
        return proposalMetadata[proposalId];
    }

    /**
     * @dev Get DAO statistics
     * @return totalProposals Total number of proposals
     * @return totalMembers Total number of members
     * @return totalVotesCast Total votes cast
     * @return treasuryBalance Current treasury balance
     */
    function getDAOStats() external view returns (
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (totalProposals, totalMembers, totalVotesCast, treasuryBalance);
    }

    // Override required functions
    function votingDelay() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber) public view override(GovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId) public view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (ProposalState) {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId) public view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.proposalThreshold();
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId) public view override(GovernorUpgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Pause the DAO (emergency only)
     */
    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the DAO
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
