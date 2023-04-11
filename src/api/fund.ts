import { FundOverview, FundOverviewWithHistoryResponse } from "../@types";
import { MonthlyEthPrice } from "../@types/monthly_eth_price";
import { TimeRange } from "../@types/timeRange";
import { ChartData } from "../hooks/useFundChartData";
import { backendInstance } from "./axios";

export const getTopFunds = async () => {
    const response = await backendInstance.get(`/fund/top-dexfunds`);
    return response.data as FundOverview[];   
}

export const getAllFunds = async () => {
    const response = await backendInstance.get(`/fund`);
    return response.data as FundOverview[];
}

export const getFundOverview = async (id: string) => {
    const response = await backendInstance.get(`/fund/${id}`)
    return response.data as FundOverview;
}

export const getFundOverviewWithHistory = async (id: string, timeRange: TimeRange) => {
    const response = await backendInstance.get(`/fund/${id}/history`, {
        params: {
            timeRange
        }
    })
    return response.data as FundOverviewWithHistoryResponse;
}

export const getMonthlyEthPrices = async () => {
    const response = await backendInstance.get(`/currency/monthly-eth-prices`);
    return response.data as MonthlyEthPrice[]
}

export const getFundChartData = async (id: string, timeRange: TimeRange) => {
    const response = await backendInstance.get(`/fund/${id}/chart`, {
        params: {
            timeRange
        }
    })
    return response.data as ChartData;
}