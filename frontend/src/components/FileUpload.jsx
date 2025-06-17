import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");
    const [fileSize, setFileSize] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

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
            await contract.add(account, ImgHash);


            alert("Successfully Uploaded Image");
            setFileName("No image selected");
            setFile(null);
            setFileSize("");
        } catch (error) {
            console.error("Pinata upload error:", error);
            alert("Unable to upload image to Pinata");
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
        <div className="top">
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="choose">
                    Choose Image
                </label>
                <input
                    disabled={!account}
                    type="file"
                    id="file-upload"
                    name="data"
                    onChange={retrieveFile}
                />

                <span className="textArea">Image: {fileName}</span>
                {fileSize && <span className="textArea">Size: {fileSize}</span>}
                <button type="submit" className="upload" disabled={!file || !contract}>
                    Upload File
                </button>

            </form>
        </div>
    );
};

export default FileUpload;
