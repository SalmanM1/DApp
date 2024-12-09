// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Fundraising {
    struct Campaign {
        address creator;
        string name;
        uint256 targetAmount;
        uint256 totalDonations;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string name, uint256 targetAmount);
    event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount);

    function createCampaign(string memory _name, uint256 _targetAmount) public {
        require(_targetAmount > 0, "Target amount must be greater than zero");

        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            name: _name,
            targetAmount: _targetAmount,
            totalDonations: 0,
            isActive: true
        });

        emit CampaignCreated(campaignCount, msg.sender, _name, _targetAmount);
        campaignCount++;
    }

    function donateToCampaign(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(msg.value > 0, "Donation amount must be greater than zero");

        campaign.totalDonations += msg.value;
        if (campaign.totalDonations >= campaign.targetAmount) {
            campaign.isActive = false;
        }

        emit DonationMade(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only the campaign creator can withdraw funds");
        require(!campaign.isActive, "Campaign is still active");
        require(campaign.totalDonations > 0, "No funds to withdraw");

        uint256 amount = campaign.totalDonations;
        campaign.totalDonations = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(_campaignId, msg.sender, amount);
    }
}