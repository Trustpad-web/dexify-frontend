import { useState, useEffect } from "react";
import { useConnectWallet } from "@web3-onboard/react";
import useUserActivities from "./useUserActivities";
import useInvestedFunds from "./useInvestedFunds";
import { InvestedFund } from "../components/FundInvestedCard";
import { PerformanceData } from "../components/PerformanceChart";
import { MONTH } from "../constants";
import { useAppSelector } from "../store";
import { FundCategoryType } from "../components/CreateVaultBasics/categories";

export type FundHolding = {
  fundAddress: string;
  fundName: string;
  historical: {
    timestamp: number;
    investedAmounnt: number;
    holdingAmount: number;
    redeemedAmount: number;
  }[];
};
export default function usePortfolio() {
  const [{ wallet }] = useConnectWallet();
  const { activities, loading: activityLoading } = useUserActivities(
    wallet?.accounts?.[0].address || "0x"
  );
  const [roiLoading, setROILoading] = useState<boolean>(false);
  const { holdingsPerFund, investorSince, investor, loading: investmentLoading } = useInvestedFunds(
    wallet?.accounts?.[0].address || "0x"
  );

  const [investedFunds, setInvestedFunds] = useState<InvestedFund[]>([]);
  const [totalAUM, setTotalAUM] = useState<number>(0);
  const [roi, setROI] = useState<number>(0);
  const [roiHistory, setRoiHistory] = useState<PerformanceData[]>([]);
  const monthlyEthPrices = useAppSelector(
    (state) => state.monthlyEthPrices.data
  );
  const meta = useAppSelector(state => state.allFunds.meta);

  useEffect(() => {
    let _totalAUM = 0, _totalInvested = 0, _totalRedeemed = 0;
    const _investedFunds: InvestedFund[] =
      holdingsPerFund?.map((fund) => {
        const fundAddress = fund.fundAddress;
        const fundActivities = activities?.filter(
          (activity) => activity.fundAddress === fundAddress
        );
        const investedAmount =
          fundActivities
            ?.filter((activity) => activity.type === "Invest")
            ?.reduce((curr, cur) => curr + cur.amount, 0) || 0;
        const redeemedAmount =
          fundActivities
            ?.filter((activity) => activity.type === "Withdraw")
            ?.reduce((curr, cur) => curr + cur.amount, 0) || 0;

        const returns = investedAmount
          ? ((fund?.userHoldingAmount || 0) +
              (redeemedAmount || 0) -
              investedAmount) /
            investedAmount
          : 0;
        _totalAUM += fund.userHoldingAmount;
        _totalInvested += investedAmount;
        _totalRedeemed += redeemedAmount;
        const _metaData = meta.find(item => item.address === fund.fundAddress);

        return {
          holdingAmount: fund.userHoldingAmount,
          id: fund.fundAddress,
          name: fund.fundName,
          returns,
          image: _metaData?.image,
          category: _metaData?.category !== undefined ? _metaData.category : FundCategoryType.ICON
        };
      }) || [];

    setTotalAUM(_totalAUM);
    setROI(
      _totalInvested
        ? (_totalAUM + _totalRedeemed - _totalInvested) / _totalInvested
        : 0
    );
    setInvestedFunds(_investedFunds);
  }, [holdingsPerFund, activities, meta]);

  // Prepare ROI chart data
  useEffect(() => {
    let _roiHistory: {
      year: number;
      month: number;
      investedAmount: number;
      redeemedAmount: number;
      holdingAmount: number;
    }[] = [];
    setROILoading(true);

    const startYear = new Date(investorSince * 1000).getUTCFullYear();
    const startMonth = new Date(investorSince * 1000).getUTCMonth();
    const currentYear = new Date().getUTCFullYear();
    const currentMonth = new Date().getUTCMonth();

    if (holdingsPerFund) {
      holdingsPerFund?.map((fund) => {
        const { fundAddress, fundName, historicalHoldings } = fund;
        const fundActivities = activities?.filter(
          (activity) => activity.fundAddress === fundAddress
        );
        const _tmpHistoricalHoldings = [...historicalHoldings];
        _tmpHistoricalHoldings.sort((a, b) => b.timestamp - a.timestamp);
        for (let i = startYear; i <= currentYear; i++) {
          for (let j = 0; j < 12; j++) {
            if (i === currentYear && j > currentMonth) {
              break;
            } else if (i === startYear && j < startMonth) {
              continue;
            }
            const timestamp =
              Math.ceil(new Date(`${i}-${j + 1}`).getTime() / 1000) + MONTH;
            const activitiesInTimeframe = fundActivities?.filter(
              (activity) => activity.timestamp <= timestamp
            );
            const investedAmount = activitiesInTimeframe
              ?.filter((activity) => activity.type === "Invest")
              .reduce((curr, cur) => curr + cur.amount, 0);
            const redeemedAmount = activitiesInTimeframe
              ?.filter((activity) => activity.type === "Withdraw")
              .reduce((curr, cur) => curr + cur.amount, 0);
            const holdingInTime = _tmpHistoricalHoldings?.find(
              (item) => timestamp >= item.timestamp
            );
            const existingROI = _roiHistory.find(
              (roi) => roi.year === i && roi.month === j
            );
            let newROI: any;
            if (holdingInTime) {
              const year = new Date(
                holdingInTime.timestamp * 1000
              ).getUTCFullYear();
              const month = new Date(
                holdingInTime.timestamp * 1000
              ).getUTCMonth();

              if (year === i && month === j) {
                newROI = {
                  year: i,
                  month: j,
                  investedAmount:
                    (existingROI?.investedAmount || 0) + (investedAmount || 0),
                  redeemedAmount:
                    (existingROI?.redeemedAmount || 0) + (redeemedAmount || 0),
                  holdingAmount:
                    (existingROI?.holdingAmount || 0) +
                    (holdingInTime.userHoldingAmount || 0),
                };
              } else {
                const ethPrice = monthlyEthPrices.find(
                  (item) => item.year == i && item.month === j
                );
                const ethPriceAtHoldingTime = monthlyEthPrices.find(
                  (item) => item.year === year && item.month === month
                );

                newROI = {
                  year: i,
                  month: j,
                  investedAmount:
                    (existingROI?.investedAmount || 0) + (investedAmount || 0),
                  redeemedAmount:
                    (existingROI?.redeemedAmount || 0) + (redeemedAmount || 0),
                  holdingAmount:
                    (existingROI?.holdingAmount || 0) +
                    (ethPriceAtHoldingTime?.price
                      ? ((holdingInTime.userHoldingAmount || 0) *
                          (ethPrice?.price || 0)) /
                        ethPriceAtHoldingTime?.price
                      : 0),
                };
              }
              _roiHistory = _roiHistory.find(
                (_roi) => _roi.year === i && _roi.month === j
              )
                ? _roiHistory.map((_roi) => {
                    if (i === _roi.year && j === _roi.month) {
                      return newROI;
                    } else {
                      return _roi;
                    }
                  })
                : [..._roiHistory, newROI];
            }
          }
        }

        const _newROI = [];
        _roiHistory = _roiHistory.map(_roi => {
          if (_roi.year === currentYear && _roi.month === currentMonth) {
            return {
              ..._roi,
              holdingAmount: totalAUM
            }
          } else {
            return _roi;
          }
        })
        for (let i = startYear; i <= currentYear; i++) {
          for (let j = 0; j < 12; j ++) {
            if ((i === startYear && j < startMonth) || (i === currentYear && j > currentMonth)) {
              _newROI.push({
                year: i,
                month: j,
                investedAmount: 0,
                redeemedAmount: 0,
                holdingAmount: 0,
              })
            } else {
              _newROI.push(_roiHistory.find(_roi => _roi.year === i && _roi.month === j));
            }
          }
        }

        setRoiHistory(
          _newROI.map((_roi) => ({
            year: _roi?.year || 0,
            month: _roi?.month || 0,
            performanceBips: _roi?.investedAmount
              ? (_roi.holdingAmount +
                  _roi.redeemedAmount -
                  _roi.investedAmount) /
                _roi.investedAmount * 100
              : 0,
          }))
        );
        setROILoading(false);
      });
    }
  }, [activities, holdingsPerFund, investorSince, totalAUM, monthlyEthPrices]);

  return {
    activities,
    holdingsPerFund,
    investedFunds,
    totalAUM,
    roi,
    roiHistory,
    roiLoading,
    loading: activityLoading,
    investmentLoading,
    investorSince,
    investor
  };
}
