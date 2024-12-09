const hre = require("hardhat");

async function main() {
    const Fundraising = await hre.ethers.getContractFactory("Fundraising");
    const fundraising = await Fundraising.deploy();

    await fundraising.waitForDeployment();

    const contractAddress = await fundraising.getAddress();
    console.log("Fundraising deployed to:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
