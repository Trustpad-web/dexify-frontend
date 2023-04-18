import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backendAPI from "../api";
import { FundOverviewWithHistoryResponse } from "../@types";
import { TimeRange } from "../@types/timeRange";

export default function useFundDetails(timeRange: TimeRange) {
  const { id } = useParams();
  const [fund, setFund] = useState<FundOverviewWithHistoryResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      backendAPI.fund.getFundOverviewWithHistory(id, timeRange)
        .then((res) => setFund(res))
        .catch((err) => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return { fund, loading };
}
