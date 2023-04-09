import { DocumentNode, gql } from "@apollo/client/core";

export const shareRedeemedQuery = (
  fund: string,
  investor: string,
): DocumentNode => {
  return gql`
    query sharesRedeemed {
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
        transaction {
          id
        }
      }
    }
  `;
};
