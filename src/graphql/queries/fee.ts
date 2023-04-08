import { DocumentNode, gql } from "@apollo/client/core";
import { AssetFragment } from "./fragments/asset.fragment";

export const feeQuery = (id: string): DocumentNode => {
  return gql`
    ${AssetFragment}
    query fee {
      fund(id: "${id}") {
        comptrollerProxies(where: {status:COMMITTED}) {
        status
        feeManagerConfigData
        policyManagerConfigData
        denominationAsset {
            ...assetFragment
        }
        sharesActionTimelock
        }
      }
    }
  `;
};
