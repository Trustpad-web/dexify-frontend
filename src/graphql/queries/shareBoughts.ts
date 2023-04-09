import { DocumentNode, gql } from "@apollo/client/core";

export const sharesBoughtsQuery = (
  fund: string,
  investor: string,
  denominationAsset: string,
): DocumentNode => {
  return gql`
    query sharesBoughts {
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
        transaction {
          id
        }
      }
    }
  `;
};
