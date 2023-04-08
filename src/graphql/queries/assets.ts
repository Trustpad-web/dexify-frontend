import { DocumentNode, gql } from "@apollo/client/core";
import { AssetFragment } from "./fragments/asset.fragment";

export const assetsQuery = (): DocumentNode => {
  return gql`
    ${AssetFragment}
    query assets {
      assets {
        ...assetFragment
      }
    }
  `;
};
