import { gql } from '@apollo/client/core';
import { AssetFragment } from './asset.fragment';

export const PortfolioFragment = gql`
  ${AssetFragment}
  fragment portfolioFragment on PortfolioState {
    timestamp
    holdings {
      amount
      asset {
        ...assetFragment
      }
      price {
        price
      }
    }
  }
`;
