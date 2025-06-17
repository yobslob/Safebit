import { useState, useEffect } from "react";


const Display = ({ contract, account, chainId, refreshKey }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        const OtherAddress = document.querySelector(".address").value.trim();

        let dataArray;
        setIsLoading(true);

        try {
            if (OtherAddress.length > 0) {
                dataArray = await contract.display(OtherAddress);
            } else {
                dataArray = await contract.display(account);
            }
            if (dataArray.length === 0) {
                alert("No image to display");
                return;
            }
            const images = dataArray.map((url, i) => {
                const cleanUrl = url.startsWith("ipfs://")
                    ? `https://gateway.pinata.cloud/ipfs/${url.slice(7)}`
                    : url;
                return (
                    <a href={cleanUrl} key={i} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="card-hover bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={cleanUrl}
                                alt={`uploaded-${i}`}
                                className="w-full h-48 sm:h-56 md:h-64 object-cover"
                            />
                            <div className="p-3 bg-gray-900">
                                <p className="text-xs text-gray-400 truncate">Image #{i + 1}</p>
                            </div>
                        </div>
                    </a>
                );
            });
            setData(images);
        } catch (error) {
            console.error("Access denied or error:", error);
            alert("You don't have access or something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [refreshKey]);


    return (
        <div className="container-custom fade-in">
            <div className="glass p-6 mb-8">
                <div className="text-center mb-6">
                    <h2 className="gradient-text text-2xl font-bold text-shadow-lg">View Images</h2>
                </div>

                <div className="bg-gray-700 bg-opacity-30 rounded-lg p-4 mb-6">
                    <p className="text-gray-300 text-sm mb-4 text-center">
                        🌐 Chain ID: <span className="text-blue-400 font-mono font-medium">{chainId ?? "Loading..."}</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <input
                            type="text"
                            placeholder="Enter wallet address (leave empty for your images)"
                            className="address input-field focus-ring flex-1 max-w-md"
                        />
                        <button
                            className={`btn-primary w-full sm:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={getData}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="spinner w-4 h-4"></div>
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                "🔍 Get Images"
                            )}
                        </button>
                    </div>
                </div>

                {data.length > 0 && (
                    <div className="slide-up">
                        <h3 className="text-white text-lg font-semibold mb-4 text-center">
                            📸 Found {data.length} image{data.length !== 1 ? 's' : ''}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {data}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Display;