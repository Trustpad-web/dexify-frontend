import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { userInvestments } from "../graphql/queries/userInvestments";
import { AccountDto } from "../@types/account";
import { InvestedFund } from "../components/FundInvestedCard";
import { useAppSelector } from "../store";
import { FundOverview } from "../@types";
import { InvestmentDto, InvestmentStateDto } from "../@types/investment";

export type HistoricalHolding = {
  timestamp: number;
  userHoldingAmount: number;
};

export default function useInvestedFunds(investor: string) {
  const { loading, error, data } = useQuery<{ account: AccountDto }>(
    userInvestments(investor || "0x")
  );
  const currentEthPrice = useAppSelector(
    (state) => state.currency.data.price?.price
  );

  const [holdingsPerFund, setHoldingsPerFund] = useState<
    {
      fundAddress: string;
      fundName: string;
      userHoldingAmount: number;
      historicalHoldings: HistoricalHolding[];
    }[]
  >();

  const getCurrentUserHoldingAmount = (
    fund: FundOverview,
    userShareAmount: number
  ) => {
    const aum = fund.portfolio?.holdings.reduce(
      (curr, cur) => curr + Number(cur.amount) * Number(cur.asset.price?.price),
      0
    );
    const userShare = userShareAmount;
    const currentTotalShareSupply = Number(fund.shares?.totalSupply);
    const userHoldingAmount =
      ((aum || 0) * Number(currentEthPrice) * userShare) /
      currentTotalShareSupply;

    return userHoldingAmount;
  };

  const gethistoricalHoldings = (stateHistory: InvestmentStateDto[]) => {
    const historicalHoldings = stateHistory.map((state) => {
      const { shares: userShareAmount, fundState, timestamp } = state;
      const { shares: totalShares, currencyPrices, portfolio } = fundState;
      const holdingAmount =
        portfolio?.holdings.reduce(
          (curr, cur) => curr + Number(cur.amount) * Number(cur.price.price),
          0
        ) || 0;
      const userHoldingAmount =
        Number(totalShares?.totalSupply) > 0
          ? (Number(userShareAmount) *
              holdingAmount *
              Number(currencyPrices?.[0].price)) /
            Number(totalShares?.totalSupply)
          : 0;
      return {
        timestamp: Number(timestamp),
        userHoldingAmount,
      };
    });

    return historicalHoldings;
  };

  useEffect(() => {
    if (data) {
      const investments = data?.account?.investments;
      const _holdings: {
        fundAddress: string;
        fundName: string;
        userHoldingAmount: number;
        historicalHoldings: HistoricalHolding[];
      }[] = [];

      investments?.map((investment) => {
        const { fund, shares, stateHistory } = investment;
        const aum = getCurrentUserHoldingAmount(fund, Number(shares));
        const historicalHoldings = gethistoricalHoldings(stateHistory);

        _holdings.push({
          fundAddress: fund.id,
          fundName: fund.name,
          userHoldingAmount: aum,
          historicalHoldings,
        });
      });

      setHoldingsPerFund(_holdings);
    }
  }, [data, currentEthPrice]);

  return { holdingsPerFund, investorSince: Number(data?.account?.investorSince), investor: data?.account?.investor, loading };
}
