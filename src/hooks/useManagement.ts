import { useConnectWallet } from "@web3-onboard/react";
import useManagementFunds from "./useManagementFunds";
import useTradesHistory from "./useTradesHistory";
import { useAppSelector } from "../store";

export default function useManagements() {
  const [{ wallet }] = useConnectWallet();
  const { loading, managedFunds, managerSince, manager, holdingHistory } =
    useManagementFunds(wallet?.accounts?.[0]?.address || "0x");
  const { tradeHistory, loading: historyLoading } = useTradesHistory(
    wallet?.accounts?.[0]?.address || "0x"
  );

  const totalAUM =
    managedFunds?.reduce((curr, cur) => curr + cur.holdingAmount, 0) || 0;
  const aggregatedSharePricesChanges =
    totalAUM > 0
      ? (managedFunds?.reduce(
          (curr, cur) => curr + cur.holdingAmount * cur.returns,
          0
        ) || 0) / totalAUM
      : 0;

  const startYear = new Date().getUTCFullYear();
  const startMonth = new Date().getUTCMonth();
  const chartData = holdingHistory?.map((item) => {
    if (startYear === item.year && startMonth === item.month) {
      return {
        ...item,
        aum: totalAUM,
        sharePrice: item.aum ? (totalAUM / item.aum) * item.sharePrice : 0,
      };
    } else {
      return item;
    }
  }) || [];

  return {
    loading,
    managedFunds,
    managerSince,
    manager: manager?.manager,
    totalAUM,
    roi: aggregatedSharePricesChanges,
    tradeHistory,
    historyLoading,
    chartData,
  };
}
