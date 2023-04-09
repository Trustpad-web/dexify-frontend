import { DocumentNode, gql } from "@apollo/client/core";

export const fundActivities = (
  fund: string,
  denominationAsset: string
): DocumentNode => {
  return gql`
    query fundActivities {
        #  Invest
      sharesBoughtEvents(
        orderBy: timestamp
        orderDirection: asc
        where: {
          fund: "${fund}"
        }
      ) {
        timestamp
        investor {
          id
        }
        investmentAmount
        shares
        fundState {
          currencyPrices(where: { currency: "ETH" }) {
            timestamp
            price
          }
          portfolio {
            holdings(
              where: { asset: "${denominationAsset}" }
            ) {
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
            fund: "${fund}"
            }
        ) {
            timestamp
            investor {
              id
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
