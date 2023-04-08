import { DocumentNode, gql } from "@apollo/client/core";

export const fundActivitiesPerInvestor = (
  fund: string,
  investor: string,
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
          investor: "${investor}"
        }
      ) {
        timestamp
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
      }

        #   Withdrawal
        sharesRedeemedEvents(
            orderBy: timestamp
            orderDirection: asc
            where: {
            fund: "${fund}"
            investor: "${investor}"
            }
        ) {
            timestamp
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
        }
    }
  `;
};
