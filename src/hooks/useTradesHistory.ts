import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { tradesQuery } from "../graphql/queries/trades";
import { TradeHistoryDto } from "../@types/tradeHistory";
import { TradeActivity } from "../components/TradeActionTable";
import { getAdapterNameById, getTradeMethodName } from "../helpers";

export default function useTradesHistory(
  manager?: string,
  fund?: string,
  filterByManager: boolean = true
) {
  const query = filterByManager
    ? tradesQuery(manager || "0x")
    : tradesQuery(fund || "0x");
  const { loading, error, data } = useQuery<TradeHistoryDto>(query);
  const trades = data?.tokenSwapTrades;
  const [tradeHistory, setTradeHistory] = useState<TradeActivity[]>([]);

  useEffect(() => {
    const _history: TradeActivity[] =
      trades?.map((trade) => {
        const {
          timestamp,
          fund,
          adapter,
          method,
          fundState,
          incomingAssetAmount,
          outgoingAssetAmount,
        } = trade;

        const {
          asset: incomingAsset,
          amount: inTokenAmount,
          price: { price: inTokenPrice },
        } = incomingAssetAmount;

        const {
          asset: outgoingAsset,
          amount: outTokenAmount,
          price: { price: outTokenPrice },
        } = outgoingAssetAmount;

        const ethPrice = fundState.currencyPrices?.[0]?.price;

        const inAmount =
          Number(inTokenAmount) * Number(inTokenPrice) * Number(ethPrice);
        const outAmount =
          Number(outTokenAmount) * Number(outTokenPrice) * Number(ethPrice);

        return {
          timestamp: Number(timestamp),
          fundAddress: fund.id,
          fundName: fund.name,
          inTokenAmount: Number(inTokenAmount),
          outTokenAmount: Number(outTokenAmount),
          inAmount,
          outAmount,
          incomingAsset,
          outgoingAsset,
          type: getTradeMethodName(method),
          adapter: getAdapterNameById(adapter.identifier),
        };
      }) || [];

    setTradeHistory(_history);
  }, [trades]);

  return { loading, tradeHistory };
}
