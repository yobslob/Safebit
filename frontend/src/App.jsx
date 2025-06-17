import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Upload from './artifacts/contracts/Upload.sol/Upload.json';
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Modal from './components/Modal';
import './styles/index.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_LOCALHOST;
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract);
        setProvider(provider);

        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
      } else {
        alert('MetaMask is not installed');
      }
    };
    init();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}

      <div className="App">
        <h1 style={{ color: 'white' }}>Safebit</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: 'white' }}>
          Account: {account || 'Not connected'}
        </p>

        <FileUpload account={account} provider={provider} contract={contract} />
        <Display account={account} contract={contract} />
      </div>
    </>
  );
}

export default App;
