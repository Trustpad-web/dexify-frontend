import { useCallback } from "react";
import { VaultLib__factory } from "../../web3/abi/types";
import useProvider from "../useProvider";

export const useVaultLib = () => {
  const provider = useProvider();

  const signer = provider?.getSigner();
  const getVaultLibContract = useCallback(
    (address: string) => {
      if (!provider || !address) return undefined;
      return VaultLib__factory.connect(address, signer || provider);
    },
    [provider, signer]
  );

  return { getVaultLibContract };
};

export const useVaultLibContract = () => {
  const { getVaultLibContract } = useVaultLib();

  const getAccessorAddr = useCallback(
    async (fundAddr: string): Promise<string> => {
      const vaultLibContract = getVaultLibContract(fundAddr);
      if (!vaultLibContract) return "";
      return await vaultLibContract?.getAccessor();
    },
    [getVaultLibContract]
  );

  return { getAccessorAddr };
};
