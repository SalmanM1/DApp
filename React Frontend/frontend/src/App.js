// src/App.js
import React, { useState } from 'react';
import WalletConnector from './components/WalletConnector';
import TokenDashboard from './components/TokenDashboard';
import ZakatDonations from './components/ZakatDonations';
import Fundraising from './components/Fundraising';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  return (
    <div className="App">
      <h1>DApp Project: Zakat Donations and Fundraising</h1>
      {!account ? (
        <WalletConnector setAccount={setAccount} />
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <nav>
            <button onClick={() => window.location.href = '#token'}>Token Dashboard</button>
            <button onClick={() => window.location.href = '#zakat'}>Zakat Donations</button>
            <button onClick={() => window.location.href = '#fundraising'}>Fundraising Campaigns</button>
          </nav>

          <section id="token">
            <TokenDashboard account={account} />
          </section>

          <section id="zakat">
            <ZakatDonations account={account} />
          </section>

          <section id="fundraising">
            <Fundraising account={account} />
          </section>
        </div>
      )}
    </div>
  );
}

export default App;