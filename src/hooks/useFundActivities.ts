import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { fundActivities } from "../graphql/queries/fundActivities";
import { FundActivityDto } from "../@types/fundActivity";
import { AssetDto } from "../@types";
import { BigNumber } from "ethers";
import { TransactionDto } from "../@types/transaction";

export type FundActivity = {
  timestamp: number;
  investor: string;
  assets: (AssetDto | undefined)[];
  amount: number;
  type: "Withdraw" | "Invest";
  transaction: TransactionDto;
};

export default function useFundActivities(
  fundId: string,
  denominationAsset?: AssetDto
) {
  const [activities, setActivities] = useState<FundActivity[]>();
  const { loading, error, data } = useQuery<FundActivityDto>(
    fundActivities(fundId, denominationAsset?.id || "0x")
  );

  // TODO Pagination or merged result
  useEffect(() => {
    if (data) {
      const { sharesBoughtEvents, sharesRedeemedEvents } = data;
      const invests: FundActivity[] = sharesBoughtEvents.map((boughtEvent) => {
        const investor = boughtEvent.investor.id;
        const timestamp = Number(boughtEvent.timestamp);
        const assets = [denominationAsset];
        const amount =
          Number(boughtEvent.investmentAmount) *
          Number(boughtEvent?.fundState?.portfolio?.holdings?.[0].price?.price) *
          Number(boughtEvent?.fundState?.currencyPrices?.[0]?.price);
        const type = "Invest";
        const transaction = boughtEvent.transaction;
        return {
          investor,
          timestamp,
          assets,
          amount,
          type,
          transaction
        };
      });

      const redeems: FundActivity[] = sharesRedeemedEvents.map(
        (redeemEvent) => {
          const investor = redeemEvent.investor.id;
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
            investor,
            timestamp,
            assets,
            amount,
            type,
            transaction
          };
        }
      );

      const _activities: FundActivity[] = invests.concat(redeems);
      _activities.sort((a, b) => a.timestamp - b.timestamp);
      setActivities(_activities);
    }
  }, [data]);

  return {activities, loading}

}
