import { useEffect } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import { useAppDispatch } from "../store";
import { useApolloClient } from "@apollo/client";
import { loadMonthlyPortfolioData } from "../store/slices/portfolio.slice";

export default function usePortfolio() {
  const [{ wallet }] = useConnectWallet();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (wallet) {
      dispatch(
        loadMonthlyPortfolioData({
          apolloClient: apolloClient,
          id: wallet?.accounts?.[0]?.address,
        })
      );
    }
  }, [wallet, dispatch, apolloClient]);
}
