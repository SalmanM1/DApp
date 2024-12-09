const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Token = await hre.ethers.getContractFactory("MyToken");

    // Set the initial token supply (e.g., 1,000,000 tokens)
    const initialSupply = hre.ethers.parseEther("1000000"); // Adjust the supply as needed

    // Deploy the contract
    const token = await Token.deploy(initialSupply);

    // Wait for the deployment to complete
    await token.waitForDeployment();

    // Log the deployed contract address
    console.log("Token deployed to:", await token.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });