import { useMemo } from "react";
import { fundDeployer } from "../../web3/abi";
import useProvider from "../useProvider";
import { FundDeployer__factory } from "../../web3/abi/types";

export const useFundDeployerContract = () => {
  const provider = useProvider();
  const signer = provider?.getSigner();
  const fundDeployerContract = useMemo(() => {
    if (!signer) return undefined;
    return FundDeployer__factory.connect(
      fundDeployer.address,
      signer || provider
    );
  }, [provider]);

  return fundDeployerContract;
};
