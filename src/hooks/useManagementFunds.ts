import { useQuery } from "@apollo/client";
import { userManagements } from "../graphql/queries/userManagements";
import { AccountDto } from "../@types/account";
import { useEffect, useState } from "react";
import { InvestedFund } from "../components/FundInvestedCard";
import { useAppSelector } from "../store";
import { MONTH } from "../constants";
import { FundCategoryType } from "../components/CreateVaultBasics/categories";

export default function useManagementFunds(manager: string) {
  const { loading, error, data } = useQuery<{ account: AccountDto }>(
    userManagements(manager || "0x")
  );

  const [managedFunds, setManagedFunds] = useState<InvestedFund[]>([]);
  const meta = useAppSelector(state => state.allFunds.meta);
  const currentEthPrice = useAppSelector(
    (state) => state.currency.data.price?.price
  );
  const monthlyEthPrices = useAppSelector(
    (state) => state.monthlyEthPrices.data
  );

  const [holdingHistory, setHoldingHistory] = useState<
    {
      year: number;
      month: number;
      aum: number;
      sharePrice: number;
    }[]
  >();

  useEffect(() => {
    const management = data?.account?.managements;
    if (management && management.length > 0) {
      let _holdingHistory: {
        fundId: string;
        year: number;
        month: number;
        timestamp: number;
        aum: number;
        sharePrice: number;
      }[] = [];
      const _managedFunds: InvestedFund[] =
        management?.map((fund) => {
          let aum =
            fund.portfolio?.holdings.reduce(
              (curr, cur) =>
                curr + Number(cur.amount) * Number(cur.asset.price?.price),
              0
            ) || 0;
          aum *= Number(currentEthPrice);

          const totalShareSupply = Number(fund.shares?.totalSupply);
          const sharePrice = totalShareSupply ? aum / totalShareSupply : 0;

          let aumInception =
            fund.stateHistory?.[1]?.portfolio?.holdings.reduce(
              (curr, cur) =>
                curr + Number(cur.amount) * Number(cur.price?.price),
              0
            ) || 0;
          let ethPrice = Number(
            fund.stateHistory?.[1]?.currencyPrices?.[0]?.price
          );
          aumInception *= ethPrice;
          const totalShareSupplyInception = Number(
            fund.stateHistory?.[1]?.shares?.totalSupply
          );
          const initialSharePrice = totalShareSupplyInception
            ? aumInception / totalShareSupplyInception
            : 0;

          fund.stateHistory?.map((state) => {
            let aum =
              state.portfolio?.holdings.reduce(
                (curr, cur) =>
                  curr + Number(cur.amount) * Number(cur.price?.price),
                0
              ) || 0;
            const ethPrice = Number(state.currencyPrices?.[0]?.price);
            aum *= ethPrice;
            const shareSupply = Number(state.shares?.totalSupply);
            const timestamp = Number(state.timestamp);
            const year = new Date(timestamp * 1000).getUTCFullYear();
            const month = new Date(timestamp * 1000).getUTCMonth();

            const existingHolding = _holdingHistory.find(
              (item) =>
                item.fundId === fund.id &&
                item.year === year &&
                item.month === month
            );
            
            if (existingHolding && existingHolding.timestamp < timestamp) {
              _holdingHistory = _holdingHistory.map((item) => {
                if (
                  item.fundId === fund.id &&
                  item.year === year &&
                  item.month === month
                ) {
                  return {
                    fundId: fund.id,
                    year,
                    month,
                    aum,
                    timestamp,
                    sharePrice: shareSupply ? aum / shareSupply : 0,
                  };
                } else {
                  return item;
                }
              });
            } else if (existingHolding) {
            } else {
              _holdingHistory.push({
                fundId: fund.id,
                year,
                month,
                aum,
                timestamp,
                sharePrice: shareSupply ? aum / shareSupply : 0,
              });
            }
          });
          const _metadata = meta.find(item => item.address === fund.id);
          return {
            holdingAmount: aum,
            id: fund.id,
            name: fund.name,
            returns: initialSharePrice
              ? sharePrice
                ? (sharePrice - initialSharePrice) / initialSharePrice
                : 0
              : 0,
            image: _metadata?.image,
            category: _metadata?.category || FundCategoryType.ICON
          };
        }) || [];
      setManagedFunds(_managedFunds);

      // Calculate performance data (monthly share price history)
      _holdingHistory.sort((a, b) => b.timestamp - a.timestamp);
      const _history: {
        year: number;
        month: number;
        aum: number;
        sharePrice: number;
      }[] = [];
      const managerSince = Number(data?.account.managerSince || 0);
      const startYear = new Date(managerSince * 1000).getUTCFullYear();
      const startMonth = new Date(managerSince * 1000).getUTCMonth();
      const currentYear = new Date().getUTCFullYear();
      const currentMonth = new Date().getUTCMonth();
      for (let i = startYear; i <= currentYear; i++) {
        for (let j = 0; j < 12; j++) {
          const timestamp =
            Math.ceil(new Date(`${i}-${j + 1}`).getTime() / 1000) + MONTH;
          if (
            (i === startYear && j < startMonth) ||
            (i === currentYear && j > currentMonth)
          ) {
            _history.push({
              aum: 0,
              month: j,
              year: i,
              sharePrice: 0,
            });
            continue;
          }
          const _holdingsPerFund = _managedFunds.map((fund) => {
            const _holding = _holdingHistory
              .filter((item) => item.fundId === fund.id)
              .find((item) => timestamp >= item.timestamp);

            if (_holding) {
              const ethPrice = monthlyEthPrices.find(
                (price) => price.year === i && price.month === j
              );
              const _ethPrice = monthlyEthPrices.find(
                (price) =>
                  price.year === _holding?.year &&
                  price.month === _holding.month
              );
              _holding.aum = _ethPrice?.price
                ? (_holding.aum * (ethPrice?.price || 0)) / _ethPrice?.price
                : 0;
              _holding.sharePrice = _ethPrice?.price
                ? (_holding.sharePrice * (ethPrice?.price || 0)) /
                  _ethPrice?.price
                : 0;
            }

            return _holding;
          });

          const _aum = _holdingsPerFund.reduce(
            (curr, cur) => curr + (cur?.aum || 0),
            0
          );
          const _totalSharePrice = _holdingsPerFund.reduce(
            (curr, cur) => curr + (cur?.aum || 0) * (cur?.sharePrice || 0),
            0
          );
          _history.push({
            year: i,
            month: j,
            aum: _aum,
            sharePrice: _aum ? _totalSharePrice / _aum : 0,
          });
        }
      }

      setHoldingHistory(_history);
    }
  }, [data, monthlyEthPrices, currentEthPrice, meta]);
  return {
    managementFunds: data?.account?.managements,
    managedFunds,
    loading,
    managerSince: Number(data?.account?.managerSince || 0),
    manager: data?.account,
    holdingHistory,
  };
}
