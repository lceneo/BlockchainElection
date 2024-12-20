import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { candidates } from "../infrastructure/candidates";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    args: [candidates],
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;

deployYourContract.tags = ["YourContract"];
