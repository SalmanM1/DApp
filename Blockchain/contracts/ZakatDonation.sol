// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZakatDonation {
    mapping(address => bool) public verifiedRecipients;
    mapping(address => uint256) public donations;

    event RecipientVerified(address indexed recipient);
    event DonationMade(address indexed donor, address indexed recipient, uint256 amount);
    event FundsWithdrawn(address indexed recipient, uint256 amount);

    // Verify recipient (open to all users)
    function verifyRecipient(address _recipient) public {
        verifiedRecipients[_recipient] = true;
        emit RecipientVerified(_recipient);
    }

    // Donate to a verified recipient
    function donate(address _recipient) public payable {
        require(verifiedRecipients[_recipient], "Recipient is not verified");
        require(msg.value > 0, "Donation amount must be greater than zero");

        donations[_recipient] += msg.value;
        emit DonationMade(msg.sender, _recipient, msg.value);
    }

    // Withdraw funds (only verified recipients)
    function withdrawFunds() public {
        require(verifiedRecipients[msg.sender], "You must be a verified recipient to withdraw funds");

        uint256 amount = donations[msg.sender];
        require(amount > 0, "No funds available for withdrawal");

        donations[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(msg.sender, amount);
    }
}