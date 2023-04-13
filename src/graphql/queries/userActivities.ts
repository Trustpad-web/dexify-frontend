import { DocumentNode, gql } from "@apollo/client/core";
import { AssetFragment } from "./fragments/asset.fragment";

export const userActivities = (
  investor: string
): DocumentNode => {
  return gql`
    ${AssetFragment}
    query fundActivities {
        #  Invest
      sharesBoughtEvents(
        orderBy: timestamp
        orderDirection: asc
        where: {
          investor: "${investor}"
        }
      ) {
        timestamp
        fund {
            id
            name
            accessor {
                denominationAsset {
                    ...assetFragment
                }
            }
        }
        investmentAmount
        shares
        fundState {
          currencyPrices(where: { currency: "ETH" }) {
            timestamp
            price
          }
          portfolio {
            holdings {
              asset {
                id
              }
              price {
                price
              }
            }
          }
        }
        transaction {
          id
        }
      }

        #   Withdrawal
        sharesRedeemedEvents(
            orderBy: timestamp
            orderDirection: asc
            where: {
                investor: "${investor}"
            }
        ) {
            timestamp
            fund {
                id
                name
                accessor {
                    denominationAsset {
                        ...assetFragment
                    }
                }
            }
            shares
            payoutAssetAmounts {
                amount
                asset {
                    id
                    symbol
                    name
                    decimals
                }
                price {
                    price
                }
            }
            fundState {
                currencyPrices(where: { currency: "ETH" }) {
                    timestamp
                    price
                }
            }
            transaction {
              id
            }
        }
    }
  `;
};
