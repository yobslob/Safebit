// frontend/src/components/FileUpload.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const FileUpload = ({ contract, account, signer, triggerRefresh }) => {
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
                },
            });

            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

            if (!contract || !signer) {
                toast.error("Smart contract or signer is not initialized.");
                return;
            }

            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.add(account, ImgHash, {
                gasLimit: 300000,
            });
            await tx.wait();

            toast.success("Successfully Uploaded Image");
            triggerRefresh();
            setFileName("No image selected");
            setFile(null);
            setFileSize("");
        } catch (error) {
            console.error("Pinata upload error:", error);
            toast.error("Unable to upload image to Pinata");
        } finally {
            setIsUploading(false);
        }
    };

    const retrieveFile = (e) => {
        const data = e.target.files[0];
        if (!data) return;
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
            <div className="glass bounce-in max-w-2xl mx-auto p-6 mb-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="text-center">
                        <h2 className="gradient-text text-2xl font-bold mb-6 text-shadow-lg">
                            Upload Your Image
                        </h2>
                    </div>

                    <div className="file-info-grid">
                        <div className="info-card">
                            <div className="info-row">
                                <span className="info-label">File:</span>
                                <span className="info-value">{fileName}</span>
                            </div>
                        </div>
                        {fileSize && (
                            <div className="info-card">
                                <div className="info-row">
                                    <span className="info-label">Size:</span>
                                    <span className="info-value">{fileSize}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="button-container">
                        <label
                            htmlFor="file-upload"
                            className="btn-primary btn-compact cursor-pointer"
                        >
                            Choose
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
                        <button
                            type="submit"
                            className={`btn-success btn-compact ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={!file || !contract || isUploading}
                        >
                            {isUploading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="spinner w-3 h-3"></div>
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                "Upload"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileUpload;
