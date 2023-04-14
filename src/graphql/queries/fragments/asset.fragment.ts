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


export const AssetAmountFragment = gql`
  fragment assetAmountFragment on AssetAmount {
    amount
    price {
      price
    }
    asset {
      id
      symbol
      decimals
      price {
        price
      }
    }
  }
`