// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfunding {
    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 raisedAmount;
        uint256 deadline;
        string category;
        bool claimed;
        bool exists;
        CampaignStatus status;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    enum CampaignStatus {
        Active,
        Successful,
        Failed,
        Cancelled
    }

    uint256 private campaignCounter;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    mapping(address => uint256[]) public userCampaigns;
    mapping(address => mapping(uint256 => uint256)) public userDonationAmount;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline,
        string category
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event CampaignStatusUpdated(
        uint256 indexed campaignId,
        CampaignStatus status
    );

    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    event FundsRefunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        _;
    }

    modifier onlyCreator(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].creator, "Not campaign creator");
        _;
    }

    modifier activeCampaign(uint256 _campaignId) {
        require(campaigns[_campaignId].status == CampaignStatus.Active, "Campaign not active");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign ended");
        _;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationInDays,
        string memory _category
    ) external returns (uint256) {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_durationInDays > 0 && _durationInDays <= 365, "Invalid duration");
        
        campaignCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        Campaign storage campaign = campaigns[campaignCounter];
        campaign.id = campaignCounter;
        campaign.creator = payable(msg.sender);
        campaign.title = _title;
        campaign.description = _description;
        campaign.goalAmount = _goalAmount;
        campaign.deadline = deadline;
        campaign.category = _category;
        campaign.exists = true;
        campaign.status = CampaignStatus.Active;

        userCampaigns[msg.sender].push(campaignCounter);

        emit CampaignCreated(
            campaignCounter,
            msg.sender,
            _title,
            _goalAmount,
            deadline,
            _category
        );

        return campaignCounter;
    }

    function donate(uint256 _campaignId) 
        external 
        payable 
        campaignExists(_campaignId)
        activeCampaign(_campaignId)
    {
        require(msg.value > 0, "Donation must be greater than 0");
        Campaign storage campaign = campaigns[_campaignId];
        
        campaign.raisedAmount += msg.value;
        userDonationAmount[msg.sender][_campaignId] += msg.value;

        Donation memory donation = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        campaignDonations[_campaignId].push(donation);

        emit DonationReceived(_campaignId, msg.sender, msg.value, block.timestamp);

        if (campaign.raisedAmount >= campaign.goalAmount) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignStatusUpdated(_campaignId, CampaignStatus.Successful);
        }
    }

    function claimFunds(uint256 _campaignId) 
        external 
        campaignExists(_campaignId)
        onlyCreator(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.claimed, "Funds already claimed");
        require(
            campaign.status == CampaignStatus.Successful || 
            (campaign.status == CampaignStatus.Active && block.timestamp >= campaign.deadline),
            "Cannot claim funds yet"
        );

        campaign.claimed = true;
        uint256 amountToTransfer = campaign.raisedAmount;
        campaign.raisedAmount = 0;

        (bool success, ) = campaign.creator.call{value: amountToTransfer}("");
        require(success, "Transfer failed");

        emit FundsClaimed(_campaignId, campaign.creator, amountToTransfer);
    }

    function refund(uint256 _campaignId) 
        external 
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp >= campaign.deadline && 
            campaign.raisedAmount < campaign.goalAmount,
            "Refund not available"
        );

        uint256 donationAmount = userDonationAmount[msg.sender][_campaignId];
        require(donationAmount > 0, "No donation found");

        userDonationAmount[msg.sender][_campaignId] = 0;
        campaign.raisedAmount -= donationAmount;

        (bool success, ) = payable(msg.sender).call{value: donationAmount}("");
        require(success, "Refund failed");

        emit FundsRefunded(_campaignId, msg.sender, donationAmount);
    }

    // View functions
    function getCampaign(uint256 _campaignId) 
        external 
        view 
        returns (Campaign memory) 
    {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        return campaigns[_campaignId];
    }

    function getCampaignDonations(uint256 _campaignId)
        external
        view
        returns (Donation[] memory)
    {
        return campaignDonations[_campaignId];
    }

    function getUserCampaigns(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userCampaigns[_user];
    }

    function getUserDonationAmount(address _user, uint256 _campaignId)
        external
        view
        returns (uint256)
    {
        return userDonationAmount[_user][_campaignId];
    }

    function updateCampaignStatus(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.exists, "Campaign does not exist");
        
        if (block.timestamp >= campaign.deadline) {
            if (campaign.raisedAmount >= campaign.goalAmount) {
                campaign.status = CampaignStatus.Successful;
            } else {
                campaign.status = CampaignStatus.Failed;
            }
            emit CampaignStatusUpdated(_campaignId, campaign.status);
        }
    }
}