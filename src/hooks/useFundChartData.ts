import { useEffect, useState } from "react";
import backendAPI from "../api";
import { TimeRange } from "../@types/timeRange";
import { isValidAddress } from "../helpers/web3";

export type ChartData = {
  aumHistory: number[];
  sharePriceHistory: number[];
  timeHistory: number[];
};

export default function useFundChartData(fundId: string, timeRange: TimeRange) {
  const [chartData, setChartData] = useState<ChartData>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (isValidAddress(fundId) && timeRange) {
        setLoading(true);
      backendAPI.fund.getFundChartData(fundId, timeRange)
        .then((data) => {
          setChartData(data);
        })
        .catch((err) => {
          console.log("err...", err);
        }).finally (() => {
            setLoading(false);
        });
    }
  }, [fundId, timeRange]);

  return {chartData, loading};
}
