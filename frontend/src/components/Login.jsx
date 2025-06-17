import { useState } from "react";

const Login = ({ setAccount, setUsername }) => {
    const [inputName, setInputName] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Install MetaMask first!");
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            setUsername(inputName);
        } catch (err) {
            console.error("Wallet connection failed:", err);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-pattern flex items-center justify-center p-4">
            <div className="glass card-hover bounce-in max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="gradient-text text-4xl font-bold mb-4 text-shadow-lg">
                        🔐 SafeBit
                    </h1>
                    <p className="text-gray-300 text-lg">Secure Image Sharing on Blockchain</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            👤 Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="input-field focus-ring"
                        />
                    </div>

                    <button
                        onClick={connectWallet}
                        className={`btn-success w-full py-4 text-lg ${isConnecting || !inputName ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!inputName || isConnecting}
                    >
                        {isConnecting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="spinner w-5 h-5"></div>
                                <span>Connecting...</span>
                            </div>
                        ) : (
                            "🦊 Connect MetaMask Wallet"
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>Connect your MetaMask wallet to start sharing images securely</p>
                </div>
            </div>
        </div>
    );
};

export default Login;