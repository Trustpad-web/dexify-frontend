import { gql } from "@apollo/client";
import { DocumentNode } from "graphql";
import { AssetAmountFragment } from "./fragments/asset.fragment";

export const tradesQuery = (manager: string): DocumentNode => {
  return gql`
        ${AssetAmountFragment}
      query tradesQuery {
        # Token swap
        tokenSwapTrades(where: {fund_: {manager: "${manager}"}}, orderBy: timestamp, orderDirection: desc) {
            timestamp
            adapter {
              id
              identifier
            }
            method
            fund {
                id
                name
                manager {
                    id
                }
            }
            incomingAssetAmount {
                ...assetAmountFragment
            }
            outgoingAssetAmount {
                ...assetAmountFragment
            }
            price
            fundState {
                currencyPrices(where: {currency: "ETH"}) {
                    timestamp
                    price
                }
            }
        }
        # Stake Trades
        # Lend Trades
        # Redeem Trades...
      }
    `;
};
