import { ethers } from "ethers";

export const decodePolicyConfigData = (configData: string) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  const [minMaxInvestmentAddresses, minMaxConfigData] = abiCoder.decode(
    ["address[]", "bytes[]"],
    configData
  );
  const [min, max] = abiCoder.decode(["uint256", "uint256"], minMaxConfigData[0]);
  return { min, max };
};

export const decodeFeeConfigData = (configData: string) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  const [feeAddresses, feeArgs] = abiCoder.decode(
    ["address[]", "bytes[]"],
    configData
  );


  const entryFeeArg = feeArgs[0];
  const performanceFeeArg = feeArgs[1];

  const [entryFee] = abiCoder.decode(["uint256"], entryFeeArg);

  const [performanceFee, period] = abiCoder.decode(["uint256", "uint256"], performanceFeeArg);

  return {entryFee, performanceFee};
}
