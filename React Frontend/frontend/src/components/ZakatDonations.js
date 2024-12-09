// src/components/ZakatDonations.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ZAKAT_ABI, ZAKAT_ADDRESS } from '../utils/contractConfig';

const ZakatDonations = ({ account }) => {
  const [verifiedRecipients, setVerifiedRecipients] = useState([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifiedRecipient, setIsVerifiedRecipient] = useState(false);

  useEffect(() => {
    getVerifiedRecipients();
    checkIfVerifiedRecipient();
  }, [account]);

  const getVerifiedRecipients = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ZAKAT_ADDRESS, ZAKAT_ABI, provider);

      // Get all past events for RecipientVerified
      const filter = contract.filters.RecipientVerified();
      const events = await contract.queryFilter(filter, 0, 'latest');
      const recipients = events.map((event) => event.args.recipient);
      const uniqueRecipients = [...new Set(recipients)];
      setVerifiedRecipients(uniqueRecipients);
    } catch (error) {
      console.error(error);
    }
  };

  const donate = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ZAKAT_ADDRESS, ZAKAT_ABI, signer);

      const tx = await contract.donate(selectedRecipient, {
        value: ethers.parseEther(donationAmount),
      });
      await tx.wait();
      setMessage('Donation successful!');
    } catch (error) {
      setMessage('Donation failed.');
      console.error(error);
    }
  };

  const withdrawFunds = async () => {
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ZAKAT_ADDRESS, ZAKAT_ABI, signer);

      const tx = await contract.withdrawFunds();
      await tx.wait();
      setMessage('Withdrawal successful!');
    } catch (error) {
      setMessage('Withdrawal failed.');
      console.error(error);
    }
  };

  const checkIfVerifiedRecipient = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ZAKAT_ADDRESS, ZAKAT_ABI, provider);
      const isVerified = await contract.verifiedRecipients(account);
      setIsVerifiedRecipient(isVerified);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyRecipient = async () => {
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ZAKAT_ADDRESS, ZAKAT_ABI, signer);

      const tx = await contract.verifyRecipient(account);
      await tx.wait();
      setMessage('You are now a verified recipient!');
      checkIfVerifiedRecipient();
      getVerifiedRecipients();
    } catch (error) {
      setMessage('Verification failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Zakat Donations</h2>

      {!isVerifiedRecipient && (
        <button onClick={verifyRecipient}>Become a Verified Recipient</button>
      )}

      <h3>Verified Recipients</h3>
      <ul>
        {verifiedRecipients.map((recipient) => (
          <li key={recipient}>{recipient}</li>
        ))}
      </ul>

      <h3>Donate to a Recipient</h3>
      <form onSubmit={donate}>
        <select
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
          required
        >
          <option value="">Select Recipient</option>
          {verifiedRecipients.map((recipient) => (
            <option key={recipient} value={recipient}>
              {recipient}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Donation Amount (ETH)"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          required
        />
        <button type="submit">Donate</button>
      </form>

      {isVerifiedRecipient && (
        <button onClick={withdrawFunds}>Withdraw Funds</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ZakatDonations;