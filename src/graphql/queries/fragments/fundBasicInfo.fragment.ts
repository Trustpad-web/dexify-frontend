import { gql } from "@apollo/client";
import { PortfolioFragment } from "./portfolio.fragment";
import { AssetFragment } from "./asset.fragment";

export const FundBasicInfoFragment = gql`
  ${PortfolioFragment}
  ${AssetFragment}
  fragment fundBasicInfoFragment on Fund {
      id
      name
      inception
      accessor {
        id
        denominationAsset {
            ...assetFragment
        }
      }
      shares {
        totalSupply
      }
      portfolio {
        ...portfolioFragment
      }
  }
`;
