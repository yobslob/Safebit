import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
    const [data, setData] = useState([]);

    const getData = async () => {
        const OtherAddress = document.querySelector(".address").value;
        let dataArray;

        try {
            if (OtherAddress) {
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
                    <a href={cleanUrl} key={i} target="_blank" rel="noopener noreferrer">
                        <img src={cleanUrl} alt={`uploaded-${i}`} className="image-list" />
                    </a>
                );
            });

            setData(images);
        } catch (error) {
            console.error("Access denied or error:", error);
            alert("You don't have access or something went wrong.");
        }
    };

    return (
        <>
            <p>Chain ID: {window.ethereum?.networkVersion}</p>

            <div className="image-list">{data}</div>
            <input
                type="text"
                placeholder="Enter Address"
                className="address"
            />
            <button className="center button" onClick={getData}>
                Get Data
            </button>
        </>
    );
};

export default Display;
