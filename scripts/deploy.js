const hre = require("hardhat");

async function main() {
    //info
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    //deploy
    const Upload = await hre.ethers.getContractFactory("Upload");
    const upload = await Upload.deploy();

    await upload.waitForDeployment();

    const contractAddress = await upload.getAddress();
    console.log("Contract deployed at:", contractAddress);

    //gas
    //Wait for tx to be mined, then get gasUsed
    // const txHash = upload.deployTransaction?.hash;
    // if (!txHash) {
    //     throw new Error("No deploy transaction found (deployTransaction is undefined)");
    // }

    // const receipt = await hre.ethers.provider.waitForTransaction(txHash);
    // console.log("Deploy transaction hash:", txHash);
    // console.log("Gas used:", receipt.gasUsed.toString());

}

main().catch((error) => {
    console.error("Deployment error:", error);
    process.exitCode = 1;
});
