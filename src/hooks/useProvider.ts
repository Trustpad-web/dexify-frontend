import { useState, useEffect } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";

export default function useProvider() {
  const [{ wallet }] = useConnectWallet();

  const [ethersProvider, setEthersProvider] =
    useState<ethers.providers.Web3Provider>();

  useEffect(() => {
    if (wallet) {
      const _ethersProvider = new ethers.providers.Web3Provider(
        wallet?.provider,
        "any"
      );
      setEthersProvider(_ethersProvider);
    }
  }, [wallet]);

  return ethersProvider;
}
