import { useState } from "react";
import axios from "axios";

const FileUpload = ({ contract, account, provider, triggerRefresh }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const [fileSize, setFileSize] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                    pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
                    "Content-Type": "multipart/form-data",
                }
            });
            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            if (!contract) {
                alert("Smart contract is not loaded yet.");
                return;
            }
            const tx = await contract.add(account, ImgHash, {
                gasLimit: 300000,
            });
            await tx.wait();

            console.log("Uploading for:", account, "URL:", ImgHash);

            triggerRefresh();
            alert("Successfully Uploaded Image");
            setFileName("No image selected");
            setFile(null);
            setFileSize("");
        } catch (error) {
            console.error("Pinata upload error:", error);
            alert("Unable to upload image to Pinata");
        } finally {
            setIsUploading(false);
        }
    };

    const retrieveFile = (e) => {
        const data = e.target.files[0];
        console.log("selected file:", data);
        const reader = new FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(data);
        };
        const sizeInKB = data.size / 1024;
        const formattedSize =
            sizeInKB > 1024
                ? `${(sizeInKB / 1024).toFixed(2)} MB`
                : `${sizeInKB.toFixed(2)} KB`;
        setFileName(data.name);
        setFileSize(formattedSize);
        e.preventDefault();
    };

    return (
        <div className="container-custom">
            <div className="glass card-hover bounce-in max-w-2xl mx-auto p-6 mb-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="text-center">
                        <h2 className="gradient-text text-2xl font-bold mb-6 text-shadow-lg">Upload Your Image</h2>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <label
                            htmlFor="file-upload"
                            className="btn-primary cursor-pointer px-8 py-4 text-lg"
                        >
                            📁 Choose Image
                        </label>
                        <input
                            disabled={!account}
                            type="file"
                            id="file-upload"
                            name="data"
                            onChange={retrieveFile}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">📄 File:</span>
                                <span className="text-white font-medium text-sm break-all ml-2">{fileName}</span>
                            </div>
                        </div>
                        {fileSize && (
                            <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">📊 Size:</span>
                                    <span className="text-white font-medium">{fileSize}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`btn-success px-10 py-4 text-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!file || !contract || isUploading}
                        >
                            {isUploading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="spinner w-5 h-5"></div>
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                "🚀 Upload to IPFS"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileUpload;