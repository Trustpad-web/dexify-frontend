import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { fundActivitiesPerInvestor } from "../graphql/queries/fundActivitiesPerInvestor";
export default function useFundActivitiesPerInvestor(
  fundId: string,
  investor: string,
  denominationAssetAddress: string
) {

  const [activities, setActivities] = useState([]);
  const {loading, error, data} = useQuery(fundActivitiesPerInvestor(fundId, investor, denominationAssetAddress));

  useEffect(() => {
    console.log("fundActivities: ", data);
  }, [data]);
}
