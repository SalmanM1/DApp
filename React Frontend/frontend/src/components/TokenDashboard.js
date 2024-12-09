// src/components/TokenDashboard.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ABI, TOKEN_ADDRESS } from '../utils/contractConfig';

const TokenDashboard = ({ account }) => {
  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (account) {
      getTokenBalance();
    }
  }, [account]);

  const getTokenBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
      const balance = await contract.balanceOf(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const transferTokens = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

      const tx = await contract.transfer(
        recipient,
        ethers.parseEther(amount)
      );
      await tx.wait();
      setMessage('Transfer successful!');
      getTokenBalance();
    } catch (error) {
      setMessage('Transfer failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Token Dashboard</h2>
      <p>Your Token Balance: {balance} MTK</p>

      <form onSubmit={transferTokens}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Transfer Tokens</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TokenDashboard;