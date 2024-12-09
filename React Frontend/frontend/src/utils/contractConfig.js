// src/utils/contractConfig.js
import FundraisingABI from './contracts/Fundraising.json';
import TokenABI from './contracts/Token.json';
import ZakatDonationABI from './contracts/ZakatDonation.json';

// Replace these addresses with your deployed contract addresses
export const FUNDRAISING_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
export const TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
export const ZAKAT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const FUNDRAISING_ABI = FundraisingABI.abi;
export const TOKEN_ABI = TokenABI.abi;
export const ZAKAT_ABI = ZakatDonationABI.abi;