// frontend/src/components/Display.jsx
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const Display = ({ contract, account, chainId, refreshKey }) => {
    const [yourData, setYourData] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [activeTab, setActiveTab] = useState("your");
    const [isLoadingYour, setIsLoadingYour] = useState(false);
    const [isLoadingFetch, setIsLoadingFetch] = useState(false);
    const fetchInputRef = useRef(null);

    const getYourData = async () => {
        if (!contract || !account) return;
        setIsLoadingYour(true);
        try {
            const dataArray = await contract.display(account);
            const files = await Promise.all(
                dataArray.map(async (url, i) => {
                    const cleanUrl = url.startsWith("ipfs://")
                        ? `https://gateway.pinata.cloud/ipfs/${url.slice(7)}`
                        : url;

                    try {
                        const res = await fetch(cleanUrl);
                        const metadata = await res.json();
                        const { name, type, ipfsUrl } = metadata;

                        const fileType = name?.split('.').pop() || '';
                        const isImage = type?.startsWith("image/");
                        const isVideo = type?.startsWith("video/");
                        const isDoc = /\.(pdf|docx?|pptx?|xlsx?)$/i.test(name);

                        return (
                            <div key={i} className="rounded-lg shadow-md overflow-hidden bg-gray-900">
                                <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                                    {isImage ? (
                                        <img
                                            src={ipfsUrl}
                                            alt={name}
                                            className="object-cover h-64 w-full"
                                        />
                                    ) : isVideo ? (
                                        <video
                                            src={ipfsUrl}
                                            controls
                                            className="w-full h-64 bg-black"
                                        />
                                    ) : isDoc ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-white font-semibold p-4 text-center">
                                            📄 {fileType.toUpperCase()}<br />
                                            <span className="text-xs font-normal mt-2">{name}</span>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-white font-semibold">
                                            ❓ Unknown File
                                        </div>
                                    )}
                                </a>
                            </div>
                        );
                    } catch (err) {
                        console.error("Error parsing metadata:", err);
                        return null;
                    }
                })
            );


            setYourData(files);
        } catch (error) {
            console.error("Failed to fetch own data:", error);
            toast.error("Could not load your files.");
        } finally {
            setIsLoadingYour(false);
        }
    };

    const getFetchedData = async () => {
        const otherAddress = fetchInputRef.current?.value?.trim();
        if (!otherAddress) return toast.error("Enter a wallet address");

        setIsLoadingFetch(true);
        try {
            const dataArray = await contract.display(otherAddress);
            if (dataArray.length === 0) {
                toast.error("No files found for this address");
                setFetchedData([]);
                return;
            }
            const files = await Promise.all(
                dataArray.map(async (url, i) => {
                    const cleanUrl = url.startsWith("ipfs://")
                        ? `https://gateway.pinata.cloud/ipfs/${url.slice(7)}`
                        : url;

                    try {
                        const res = await fetch(cleanUrl);
                        const metadata = await res.json();
                        const { name, type, ipfsUrl } = metadata;

                        const fileType = name?.split('.').pop() || '';
                        const isImage = type?.startsWith("image/");
                        const isVideo = type?.startsWith("video/");
                        const isDoc = /\.(pdf|docx?|pptx?|xlsx?)$/i.test(name);

                        return (
                            <div key={i} className="rounded-lg shadow-md overflow-hidden bg-gray-900">
                                <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                                    {isImage ? (
                                        <img
                                            src={ipfsUrl}
                                            alt={name}
                                            className="object-cover h-64 w-full"
                                        />
                                    ) : isVideo ? (
                                        <video
                                            src={ipfsUrl}
                                            controls
                                            className="w-full h-64 bg-black"
                                        />
                                    ) : isDoc ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-white font-semibold p-4 text-center">
                                            📄 {fileType.toUpperCase()}<br />
                                            <span className="text-xs font-normal mt-2">{name}</span>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-white font-semibold">
                                            ❓ Unknown File
                                        </div>
                                    )}
                                </a>
                            </div>
                        );
                    } catch (err) {
                        console.error("Error parsing metadata:", err);
                        return null;
                    }
                })
            );


            setFetchedData(files);
            toast.success(`Found ${files.length} files`);
        } catch (err) {
            console.error("Fetch failed:", err);
            toast.error("Access denied or error occurred");
        } finally {
            setIsLoadingFetch(false);
        }
    };

    useEffect(() => {
        getYourData();
    }, [refreshKey, contract, account]);

    return (
        <div className="container-custom">
            <div className="glass p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-xl font-bold">Image Gallery</h2>
                    <span className="text-blue-400 font-mono text-sm">
                        Chain ID: {chainId ?? "Loading..."}
                    </span>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button
                        className={`btn-primary ${activeTab === "your" ? "active" : ""}`}
                        onClick={() => setActiveTab("your")}
                    >
                        Your Data
                    </button>
                    <button
                        className={`btn-primary ${activeTab === "fetch" ? "active" : ""}`}
                        onClick={() => setActiveTab("fetch")}
                    >
                        Fetch Others
                    </button>
                </div>

                {activeTab === "your" && (
                    <div>
                        {isLoadingYour ? (
                            <p className="text-gray-300">Loading your files...</p>
                        ) : yourData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{yourData}</div>
                        ) : (
                            <p className="text-gray-400">No files found</p>
                        )}
                    </div>
                )}

                {activeTab === "fetch" && (
                    <div>
                        <div className="flex gap-4 mb-4">
                            <input
                                ref={fetchInputRef}
                                type="text"
                                placeholder="Enter wallet address"
                                className="input-field focus-ring flex-1"
                            />
                            <button
                                className={`btn-primary ${isLoadingFetch ? "opacity-50" : ""}`}
                                onClick={getFetchedData}
                                disabled={isLoadingFetch}
                            >
                                {isLoadingFetch ? "Fetching..." : "Fetch"}
                            </button>
                        </div>
                        {fetchedData.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {fetchedData}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Display;
