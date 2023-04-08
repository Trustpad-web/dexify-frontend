import { gql } from "@apollo/client";

export const AssetFragment = gql`
  fragment assetFragment on Asset {
    id
    name
    symbol
    decimals
    price {
      price
    }
    daily {
        open
    }
  }
`;
