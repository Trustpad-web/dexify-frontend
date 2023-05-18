import { BigNumber, ethers } from "ethers";

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

  let entryFeeArg, performanceFeeArg, managementFeeArg;

  if (feeArgs?.[0]?.length > feeArgs?.[1]?.length) {
    entryFeeArg = feeArgs?.[1];
    performanceFeeArg = feeArgs?.[0];
    managementFeeArg = feeArgs?.[2];
  } else {
    entryFeeArg = feeArgs?.[0];
    performanceFeeArg = feeArgs?.[1];
    managementFeeArg = feeArgs?.[2];
  }

  console.log("FeeArg: ", entryFeeArg, performanceFeeArg, managementFeeArg)

  let entryFee, performanceFee, managementFee;
  try {
    const [_entryFee] = abiCoder.decode(["uint256"], entryFeeArg);
    console.log("entryFee: ", _entryFee, _entryFee.toString())
    entryFee = _entryFee;
  } catch {
    entryFee = BigNumber.from(0);
  }
  try {
    const [_performanceFee, period] = abiCoder.decode(["uint256", "uint256"], performanceFeeArg);
    console.log("performanceFee: ", _performanceFee);
    performanceFee = _performanceFee;
  } catch {
    performanceFee = BigNumber.from(0);
  }

  if (managementFeeArg) {
    try {
      const [_managementFee] = abiCoder.decode(["uint256"], managementFeeArg);
      console.log("managementFee: ", _managementFee);
      managementFee = _managementFee;
    } catch {
      managementFee = BigNumber.from(0);
    }
  } else {
    managementFee = BigNumber.from(0);
  }
  

  return {entryFee, performanceFee, managementFee};
}

export const isValidAddress = (addr: string | undefined | null) => {
  if (!addr) return false;
  if (addr === '0x' || addr === '0x0') {
    return false
  }
  return true
}

export const signMessage = async (
  signer: ethers.Signer
) => {
  const address = await signer.getAddress();
  const signature = await signer.signMessage(address);
  return { signature, address };
};
