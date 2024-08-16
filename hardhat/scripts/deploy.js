const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = registry.getAddress();

  const Partnership = await hre.ethers.getContractFactory("Partnership");
  const partnership = await Partnership.deploy(registryAddress);
  await partnership.waitForDeployment();

  console.log(
    `Registry deployed successfully to ${JSON.stringify(
      await registry.getAddress()
    )}`
  );
  console.log(
    `partnership deployed successfully to ${JSON.stringify(
      await partnership.getAddress()
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
