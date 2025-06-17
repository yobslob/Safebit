import { useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
    const sharing = async () => {
        const address = document.querySelector(".address").value;
        if (address) {
            await contract.allow(address);
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
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="title">Share with</div>
                <div className="body">
                    <input
                        type="text"
                        className="address"
                        placeholder="Enter Address"
                    />
                </div>
                <form id="myForm">
                    <select id="selectNumber">
                        <option className="address">People With Access</option>
                    </select>
                </form>
                <div className="footer">
                    <button onClick={() => setModalOpen(false)} id="cancelBtn">
                        Cancel
                    </button>
                    <button onClick={sharing}>Share</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
