import { useState } from "react";

const Login = ({ setAccount, setUsername }) => {
    const [inputName, setInputName] = useState("");

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Install MetaMask first!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            setUsername(inputName);
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-4">Safebit: Secure Image Sharing</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="mb-4 px-4 py-2 rounded text-black"
            />
            <button
                onClick={connectWallet}
                className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 transition"
                disabled={!inputName}
            >
                Connect Wallet
            </button>
        </div>
    );
};

export default Login;
