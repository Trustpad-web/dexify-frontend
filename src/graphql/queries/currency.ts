import { DocumentNode, gql } from "@apollo/client/core";

export const currencyQuery = (id: string): DocumentNode => {
  return gql`
    query currency {
      currency(id: "${id}") {
        price {
            price
        }
        daily {
            open
        }
      }
    }
  `;
};
