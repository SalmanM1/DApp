const hre = require("hardhat");

async function main() {
    const ZakatDonation = await hre.ethers.getContractFactory("ZakatDonation");
    const zakatDonation = await ZakatDonation.deploy();

    await zakatDonation.waitForDeployment();

    const contractAddress = await zakatDonation.getAddress();
    console.log("ZakatDonation deployed to:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });