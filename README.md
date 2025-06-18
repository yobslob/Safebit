# SafeBit

SafeBit is a Web3-based image-sharing DApp built using React and Solidity. It lets users upload images and securely share access to them via the blockchain. Everything runs on smart contracts and IPFS (no centralized server needed).

## About

This is a college-level project made for learning and demo purposes. It allows users to:

- Connect their MetaMask wallet
- Upload images to IPFS
- Store and share access via smart contracts
- View personal and shared files
- Use a simple and modern UI with React and TailwindCSS

Currently, only images are supported. Working on adding support for more file types and making the layout responsive.

> You’ll need MetaMask installed and connected to a testnet like Goerli.

Here’s a preview of the login page:  
![Login Page](src/assets/loginPage.png)

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Ethers.js

### Backend 
- Solidity Smart Contract (`Upload.sol`)
- Hardhat for deployment
- IPFS (via Pinata)

## Installation

```bash
npm install
```
## Local Development
To run the frontend:

```bash
npm run dev
```
#### To deploy the smart contract (in Hardhat):

```bash
npx hardhat run scripts/deploy.js --network localhost
```
### Notes
-You need to configure .env with your Pinata API keys and contract addresses.
-For testing, use Hardhat local network or Goerli.
