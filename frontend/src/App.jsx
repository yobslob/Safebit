import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Login from "./components/Login";
import "./styles/index.css";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [networkSupported, setNetworkSupported] = useState(false);

  const getContractAddress = (chainId) => {
    const id = String(chainId); // ← FIXED here
    switch (id) {
      case "31337":
        console.log("Connected Chain ID:", window.ethereum.networkVersion);
        return import.meta.env.VITE_CONTRACT_ADDRESS_LOCALHOST;
      case "5":
        console.log("Connected Chain ID:", window.ethereum.networkVersion);
        return import.meta.env.VITE_CONTRACT_ADDRESS_GOERLI;
      case "1":
        console.log("Connected Chain ID:", window.ethereum.networkVersion);
        return import.meta.env.VITE_CONTRACT_ADDRESS_MAINNET;
      default:
        console.log("Connected Chain ID:", window.ethereum.networkVersion);
        return null;
    }
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      console.log("Inside useEffect, account:", account, "username:", username);
      if (window.ethereum && account && username) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const { chainId } = await provider.getNetwork(); // BigInt like 31337n
          console.log("Connected Chain ID (BigInt):", chainId);

          const contractAddress = getContractAddress(chainId); // We fixed this
          console.log("Resolved Contract Address:", contractAddress);

          if (!contractAddress) {
            alert("Unsupported network. Please connect to Localhost, Goerli, or Mainnet.");
            setNetworkSupported(false);
            setContract(null);
            return;
          }

          const uploadContract = new ethers.Contract(contractAddress, Upload.abi, signer);
          setProvider(provider);
          setContract(uploadContract);
          console.log("Contract object set:", uploadContract); // ADD THIS
          setNetworkSupported(true);
        } catch (err) {
          console.error("Error setting up provider or contract:", err);
        }
      }
    };

    loadBlockchainData();
  }, [account, username]);



  // Login screen
  if (!account || !username) {
    return <Login setAccount={setAccount} setUsername={setUsername} />;
  }

  // Unsupported network screen
  if (!networkSupported) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Unsupported Network</h2>
          <p>Please connect your wallet to Localhost (31337), Goerli (5), or Mainnet (1).</p>
        </div>
      </div>
    );
  }

  // Still loading contract
  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Connecting to Smart Contract...</p>
      </div>
    );
  }

  console.log("Current contract state:", contract);


  // App UI
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-4">Welcome, {username}</h1>
      <p className="mb-6">Connected: {account}</p>

      {!modalOpen && (
        <button
          className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600"
          onClick={() => setModalOpen(true)}
        >
          Share
        </button>
      )}
      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}

      <FileUpload account={account} provider={provider} contract={contract} />
      <Display account={account} contract={contract} />
    </div>
  );
}

export default App;
