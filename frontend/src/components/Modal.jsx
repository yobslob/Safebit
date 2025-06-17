import { useEffect } from "react";
import { ethers } from "ethers";

const Modal = ({ setModalOpen, contract, signer }) => {
    const sharing = async () => {
        const address = document.querySelector(".address").value;
        if (address) {
            if (!ethers.isAddress(address)) {
                alert("Please enter a valid Ethereum address");
                return;
            }
            if (contract.signer && typeof contract.signer.getAddress === 'function') {
                const signerAddress = await contract.signer.getAddress();
                console.log("Signer is:", signerAddress);
            } else {
                console.warn("Contract signer is undefined or not bound correctly.");
            }

            const contractWithSigner = contract.connect(signer);
            const tx = await contractWithSigner.allow(address);
            await tx.wait();

            setModalOpen(false);
        }
    };

    useEffect(() => {
        const accessList = async () => {
            try {
                const addressList = await contract.shareAccess();
                const select = document.querySelector("#selectNumber");
                addressList.forEach(({ user }) => {
                    const option = document.createElement("option");
                    option.textContent = user;
                    option.value = user;
                    select.appendChild(option);
                });
            } catch (err) {
                console.error("Error fetching access list:", err);
            }
        };
        contract && accessList();
    }, [contract]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
            <div className="glass w-full max-w-md mx-auto slide-up">
                <div className="p-6">
                    <div className="text-xl font-semibold text-white mb-4 text-shadow">Share with</div>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="address input-field focus-ring"
                            placeholder="Enter Address"
                        />
                    </div>
                    <form id="myForm" className="mb-4">
                        <select
                            id="selectNumber"
                            className="input-field focus-ring"
                        >
                            <option className="address">People With Access</option>
                        </select>
                    </form>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setModalOpen(false)}
                            id="cancelBtn"
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={sharing}
                            className="btn-primary"
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;