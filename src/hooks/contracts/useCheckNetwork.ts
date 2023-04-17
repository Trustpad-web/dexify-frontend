import { useConnectWallet } from "@web3-onboard/react";
import { useMemo } from "react";
import { DESIRED_NEWWORK } from "../../constants/web3";
export const useCheckNetwork = () => {
  const [{ wallet }] = useConnectWallet();

  const isWrongNetwork = useMemo(
    () => !(Number(wallet?.chains?.[0]?.id) === DESIRED_NEWWORK),
    [wallet]
  );

  return { isWrongNetwork };
};
