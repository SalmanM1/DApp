// src/components/WalletConnector.js
import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnector = ({ setAccount }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const account = accounts[0];
        setAccount(account);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('MetaMask is not installed');
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect MetaMask Wallet</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletConnector;