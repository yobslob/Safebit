import { useEffect, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { ethers } from "ethers";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
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
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState('');
  const [chainId, setChainId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [signer, setSigner] = useState(null);
  const [networkSupported, setNetworkSupported] = useState(false);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const getContractAddress = (chainId) => {
    const id = String(chainId);
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
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount('');
        setUsername('');
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);


  useEffect(() => {
    const loadBlockchainData = async () => {
      console.log("Inside useEffect, account:", account, "username:", username);
      if (window.ethereum && account && username) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const { chainId } = await provider.getNetwork();
          setChainId(Number(chainId));
          console.log("Connected Chain ID (BigInt):", chainId);
          const contractAddress = getContractAddress(chainId);
          console.log("Resolved Contract Address:", contractAddress);
          if (!contractAddress) {
            toast.error("Unsupported network. Please connect to Localhost, Goerli, or Mainnet.");
            setNetworkSupported(false);
            setContract(null);
            return;
          }
          const contractReadOnly = new ethers.Contract(contractAddress, Upload.abi, provider);
          const uploadContract = contractReadOnly.connect(signer);
          setProvider(provider);
          setContract(uploadContract);
          setSigner(signer);
          console.log("Contract object set:", uploadContract);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-pattern flex items-center justify-center p-4">
        <div className="glass card-hover max-w-md p-8 text-center">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4 text-white text-shadow">Unsupported Network</h2>
          <p className="text-gray-300 leading-relaxed">
            Please connect your wallet to Localhost (31337), Goerli (5), or Mainnet (1).
          </p>
        </div>
      </div>
    );
  }

  // Still loading contract
  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-6"></div>
          <p className="text-xl text-white text-shadow">Connecting to Smart Contract...</p>
        </div>
      </div>
    );
  }

  console.log("Current contract state:", contract);

  // App UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-pattern fade-in">
      {/* Header */}
      <div className="glass sticky top-0 z-40 border-b border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 2000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              <h1 className="gradient-text text-3xl md:text-4xl font-bold text-shadow-lg">
                Welcome, {username}
              </h1>
              <p className="text-gray-300 mt-2 text-sm md:text-base flex items-center gap-2">
                🔗 Connected:
                <span className="font-mono text-blue-400 bg-gray-800 px-2 py-1 rounded">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(account);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-white hover:text-green-400 transition duration-200"
                  title="Copy to clipboard"
                >
                  {copied ? <FaCheck size={16} /> : <FaRegCopy size={16} />}
                </button>
              </p>
            </div>

            {!modalOpen && (
              <button
                className="btn-primary px-auto py-2 text-lg"
                onClick={() => setModalOpen(true)}
              >
                Share Access
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} signer={signer} />}

        <div className="space-y-8">
          <FileUpload account={account} signer={signer} contract={contract} triggerRefresh={triggerRefresh} />
          <Display account={account} contract={contract} chainId={chainId} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}

export default App;