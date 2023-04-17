import { useCallback } from "react";
import { ComptrollerLib__factory } from "../../web3/abi/types";
import useProvider from "../useProvider";

export const useComptrollerLib = () => {
  const provider = useProvider();
  const signer = provider?.getSigner();

  const getComptrollerLibContract = useCallback(
    (comptrollerAddr: string) => {
      if (!signer || !comptrollerAddr) return undefined;
      return ComptrollerLib__factory.connect(comptrollerAddr, signer);
    },
    [signer]
  );

  return { getComptrollerLibContract };
};

export const useComptrollerLibContract = () => {
  const { getComptrollerLibContract } = useComptrollerLib();

  const getDenominationAssetAddr = useCallback(
    async (accessorAddr: string): Promise<string> => {
      const comptrollerLibContract = getComptrollerLibContract(accessorAddr);
      if (!comptrollerLibContract) return "";
      return await comptrollerLibContract.getDenominationAsset();
    },
    [getComptrollerLibContract]
  );

  return { getDenominationAssetAddr };
};
