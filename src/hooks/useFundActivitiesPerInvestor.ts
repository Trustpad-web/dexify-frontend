import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { fundActivitiesPerInvestor } from "../graphql/queries/fundActivitiesPerInvestor";
import { FundActivityDto } from "../@types/fundActivity";
import { AssetDto } from "../@types";
import { BigNumber } from "ethers";

export type FundActivity = {
  timestamp: number;
  investor: string;
  assets: AssetDto[];
  amount: BigNumber;
  type: 'Withdraw' | 'Invest'
}

export default function useFundActivitiesPerInvestor(
  fundId: string,
  investor: string,
  denominationAssetAddress: string
) {

  const [activities, setActivities] = useState<FundActivity>();
  const {loading, error, data} = useQuery<FundActivityDto>(fundActivitiesPerInvestor(fundId, investor, denominationAssetAddress));

  useEffect(() => {
    console.log("fundActivities: ", data);
    
  }, [data]);
}
