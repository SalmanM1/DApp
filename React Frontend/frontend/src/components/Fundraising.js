// src/components/Fundraising.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FUNDRAISING_ABI, FUNDRAISING_ADDRESS } from '../utils/contractConfig';

const Fundraising = ({ account }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCampaigns();
  }, []);

  const getCampaigns = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(FUNDRAISING_ADDRESS, FUNDRAISING_ABI, provider);

      const campaignCount = await contract.campaignCount();
      const campaignsArray = [];

      for (let i = 0; i < campaignCount; i++) {
        const campaign = await contract.campaigns(i);
        campaignsArray.push({ id: i, ...campaign });
      }

      setCampaigns(campaignsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FUNDRAISING_ADDRESS, FUNDRAISING_ABI, signer);

      const tx = await contract.createCampaign(name, ethers.parseEther(targetAmount));
      await tx.wait();
      setMessage('Campaign created successfully!');
      getCampaigns();
    } catch (error) {
      setMessage('Failed to create campaign.');
      console.error(error);
    }
  };

  const donateToCampaign = async (campaignId) => {
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FUNDRAISING_ADDRESS, FUNDRAISING_ABI, signer);

      const tx = await contract.donateToCampaign(campaignId, {
        value: ethers.parseEther(donationAmount),
      });
      await tx.wait();
      setMessage('Donation successful!');
      getCampaigns();
    } catch (error) {
      setMessage('Donation failed.');
      console.error(error);
    }
  };

  const withdrawFunds = async (campaignId) => {
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FUNDRAISING_ADDRESS, FUNDRAISING_ABI, signer);

      const tx = await contract.withdrawFunds(campaignId);
      await tx.wait();
      setMessage('Withdrawal successful!');
      getCampaigns();
    } catch (error) {
      setMessage('Withdrawal failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Fundraising Campaigns</h2>

      <h3>Create Campaign</h3>
      <form onSubmit={createCampaign}>
        <input
          type="text"
          placeholder="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Target Amount (ETH)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <button type="submit">Create Campaign</button>
      </form>

      <h3>Active Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <p><strong>Name:</strong> {campaign.name}</p>
            <p><strong>Creator:</strong> {campaign.creator}</p>
            <p>
              <strong>Target Amount:</strong> {ethers.formatEther(campaign.targetAmount)} ETH
            </p>
            <p>
              <strong>Total Donations:</strong> {ethers.formatEther(campaign.totalDonations)} ETH
            </p>
            <p><strong>Status:</strong> {campaign.isActive ? 'Active' : 'Closed'}</p>

            {campaign.isActive && (
              <div>
                <input
                  type="text"
                  placeholder="Donation Amount (ETH)"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                />
                <button onClick={() => donateToCampaign(campaign.id)}>
                  Donate
                </button>
              </div>
            )}

            {!campaign.isActive && campaign.creator.toLowerCase() === account.toLowerCase() && (
              <button onClick={() => withdrawFunds(campaign.id)}>
                Withdraw Funds
              </button>
            )}
          </li>
        ))}
      </ul>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Fundraising;