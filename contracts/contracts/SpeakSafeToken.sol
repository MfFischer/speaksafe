// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SpeakSafeToken
 * @dev Governance token for SpeakSafe DAO with voting capabilities
 * @author SpeakSafe Team
 */
contract SpeakSafeToken is 
    ERC20,
    ERC20Burnable,
    ERC20Votes,
    ERC20Permit,
    AccessControl,
    Pausable
{
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Token economics
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10M tokens
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M tokens
    
    // Reward rates (tokens per action)
    uint256 public reportSubmissionReward = 10 * 10**18; // 10 SPEAK
    uint256 public votingReward = 1 * 10**18; // 1 SPEAK
    uint256 public verificationReward = 50 * 10**18; // 50 SPEAK
    uint256 public moderationReward = 25 * 10**18; // 25 SPEAK

    // Staking for governance
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTimestamp;
    uint256 public totalStaked;
    uint256 public minimumStakeForVoting = 100 * 10**18; // 100 SPEAK

    // Reputation system
    mapping(address => uint256) public reputationScore;
    mapping(address => bool) public isVerifiedMember;

    // Events
    event TokensStaked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardDistributed(address indexed recipient, uint256 amount, string reason);
    event ReputationUpdated(address indexed user, uint256 oldScore, uint256 newScore);
    event MemberVerified(address indexed member, uint256 timestamp);

    // Custom errors
    error ExceedsMaxSupply();
    error InsufficientStakedBalance();
    error StakingPeriodNotMet();
    error InsufficientReputationScore();
    error AlreadyVerified();

    /**
     * @dev Constructor
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _initialSupply Initial token supply
     * @param _admin Admin address
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _admin
    ) 
        ERC20(_name, _symbol)
        ERC20Permit(_name)
    {
        require(_initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(BURNER_ROLE, _admin);

        _mint(_admin, _initialSupply);
    }

    /**
     * @dev Mint tokens (minter role only)
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function mint(address _to, uint256 _amount) external onlyRole(MINTER_ROLE) {
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert ExceedsMaxSupply();
        }
        _mint(_to, _amount);
    }

    /**
     * @dev Distribute reward tokens
     * @param _recipient Recipient address
     * @param _amount Reward amount
     * @param _reason Reason for reward
     */
    function distributeReward(
        address _recipient,
        uint256 _amount,
        string calldata _reason
    ) external onlyRole(MINTER_ROLE) {
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert ExceedsMaxSupply();
        }
        
        _mint(_recipient, _amount);
        
        // Update reputation based on reward type
        if (keccak256(bytes(_reason)) == keccak256(bytes("report_submission"))) {
            reputationScore[_recipient] += 10;
        } else if (keccak256(bytes(_reason)) == keccak256(bytes("voting"))) {
            reputationScore[_recipient] += 1;
        } else if (keccak256(bytes(_reason)) == keccak256(bytes("verification"))) {
            reputationScore[_recipient] += 25;
        } else if (keccak256(bytes(_reason)) == keccak256(bytes("moderation"))) {
            reputationScore[_recipient] += 15;
        }

        emit RewardDistributed(_recipient, _amount, _reason);
    }

    /**
     * @dev Stake tokens for governance voting
     * @param _amount Amount to stake
     */
    function stake(uint256 _amount) external whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        _transfer(msg.sender, address(this), _amount);
        
        stakedBalance[msg.sender] += _amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        totalStaked += _amount;

        emit TokensStaked(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Unstake tokens (with minimum staking period)
     * @param _amount Amount to unstake
     */
    function unstake(uint256 _amount) external whenNotPaused {
        if (stakedBalance[msg.sender] < _amount) {
            revert InsufficientStakedBalance();
        }

        // Minimum staking period of 7 days
        if (block.timestamp < stakingTimestamp[msg.sender] + 7 days) {
            revert StakingPeriodNotMet();
        }

        stakedBalance[msg.sender] -= _amount;
        totalStaked -= _amount;

        _transfer(address(this), msg.sender, _amount);

        emit TokensUnstaked(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Check if user can vote in governance
     * @param _user User address
     * @return True if user can vote
     */
    function canVote(address _user) external view returns (bool) {
        return stakedBalance[_user] >= minimumStakeForVoting;
    }

    /**
     * @dev Get voting power (staked balance + reputation bonus)
     * @param _user User address
     * @return Voting power
     */
    function getVotingPower(address _user) external view returns (uint256) {
        uint256 baseVotingPower = stakedBalance[_user];
        uint256 reputationBonus = (reputationScore[_user] * baseVotingPower) / 1000; // 0.1% per reputation point
        return baseVotingPower + reputationBonus;
    }

    /**
     * @dev Verify member status (admin only)
     * @param _member Member to verify
     */
    function verifyMember(address _member) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (isVerifiedMember[_member]) {
            revert AlreadyVerified();
        }

        if (reputationScore[_member] < 100) {
            revert InsufficientReputationScore();
        }

        isVerifiedMember[_member] = true;
        reputationScore[_member] += 50; // Verification bonus

        emit MemberVerified(_member, block.timestamp);
    }

    /**
     * @dev Update reputation score (admin only)
     * @param _user User address
     * @param _newScore New reputation score
     */
    function updateReputation(
        address _user,
        uint256 _newScore
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldScore = reputationScore[_user];
        reputationScore[_user] = _newScore;
        emit ReputationUpdated(_user, oldScore, _newScore);
    }

    /**
     * @dev Burn tokens from specific address (burner role only)
     * @param _from Address to burn from
     * @param _amount Amount to burn
     */
    function burnFrom(address _from, uint256 _amount) public override onlyRole(BURNER_ROLE) {
        super.burnFrom(_from, _amount);
    }

    /**
     * @dev Get user statistics
     * @param _user User address
     * @return balance Token balance
     * @return staked Staked balance
     * @return reputation Reputation score
     * @return verified Verification status
     * @return votingPower Current voting power
     */
    function getUserStats(address _user) external view returns (
        uint256 balance,
        uint256 staked,
        uint256 reputation,
        bool verified,
        uint256 votingPower
    ) {
        balance = balanceOf(_user);
        staked = stakedBalance[_user];
        reputation = reputationScore[_user];
        verified = isVerifiedMember[_user];
        
        uint256 baseVotingPower = stakedBalance[_user];
        uint256 reputationBonus = (reputationScore[_user] * baseVotingPower) / 1000;
        votingPower = baseVotingPower + reputationBonus;
    }

    /**
     * @dev Pause token transfers (pauser role only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers (admin only)
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // Override required functions
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) whenNotPaused {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
