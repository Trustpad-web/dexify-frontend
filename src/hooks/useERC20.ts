import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ERC20, ERC20__factory } from "../web3/abi/types";

export default function useERC20(address: string) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [contract, setContract] = useState<ERC20>();

  useEffect(() => {
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
      setProvider(ethersProvider);
    }
  }, [wallet]);

  useEffect(() => {
    if (provider && address) {
      const _contract = ERC20__factory.connect(address, provider);
      setContract(_contract);
    }
  }, [provider, address]);

  const getBalance = useCallback(
    async (walletAddress: string) => {
      if (contract) {
        return await contract.balanceOf(walletAddress);
      } else {
        return BigNumber.from(0);
      }
    },
    [contract]
  );

  return { getBalance };
}
