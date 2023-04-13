import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { fundActivities } from "../graphql/queries/fundActivities";
import { FundActivityDto } from "../@types/fundActivity";
import { AssetDto, FundDto } from "../@types";
import { BigNumber } from "ethers";
import { TransactionDto } from "../@types/transaction";
import { userActivities } from "../graphql/queries/userActivities";

export type UserActivity = {
  timestamp: number;
  fundAddress: string;
  fundName: string;
  assets: (AssetDto | undefined)[];
  amount: number;
  type: "Withdraw" | "Invest";
  transaction: TransactionDto;
};

export default function useUserActivities(
  userAddress: string
) {
  const [activities, setActivities] = useState<UserActivity[]>();
  const { loading, error, data } = useQuery<FundActivityDto>(
    userActivities(userAddress || "0x")
  );

  // TODO Pagination or merged result
  useEffect(() => {
    if (data) {
      const { sharesBoughtEvents, sharesRedeemedEvents } = data;
      const invests: UserActivity[] = sharesBoughtEvents.map((boughtEvent) => {
        const timestamp = Number(boughtEvent.timestamp);
        const denominationAsset = boughtEvent.fund?.accessor.denominationAsset;
        const denominationAssetPrice = boughtEvent?.fundState?.portfolio?.holdings?.find(holding => holding.asset.id === denominationAsset?.id)?.price?.price;
        const amount =
          Number(boughtEvent.investmentAmount) *
          Number(denominationAssetPrice || 0) *
          Number(boughtEvent?.fundState?.currencyPrices?.[0]?.price);
        const type = "Invest";
        const transaction = boughtEvent.transaction;
        return {
          fundName: boughtEvent.fund?.name || "",
          fundAddress: boughtEvent.fund?.id || "0x",
          timestamp,
          assets: [denominationAsset],
          amount,
          type,
          transaction
        };
      });

      const redeems: UserActivity[] = sharesRedeemedEvents.map(
        (redeemEvent) => {
          const timestamp = Number(redeemEvent.timestamp);
          const assets = redeemEvent.payoutAssetAmounts.map(
            (holding) => holding.asset
          );
          let amount = redeemEvent.payoutAssetAmounts.reduce(
            (acc, cur) => acc + Number(cur.amount) * Number(cur.price.price),
            0
          );
          amount *= Number(
            redeemEvent.fundState.currencyPrices?.[0]?.price
          );
          const type = "Withdraw";
          const transaction = redeemEvent.transaction;

          return {
            fundName: redeemEvent.fund?.name || "",
            fundAddress: redeemEvent.fund?.id || "0x",
            timestamp,
            assets,
            amount,
            type,
            transaction
          };
        }
      );

      const _activities: UserActivity[] = invests.concat(redeems);
      _activities.sort((a, b) => a.timestamp - b.timestamp);
      setActivities(_activities);
    }
  }, [data]);

  return {activities, loading}

}
