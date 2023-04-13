import { DocumentNode, gql } from "@apollo/client/core";
import { FundStateFragment } from "./fragments/fundState.fragment";
import { FundBasicInfoFragment } from "./fragments/fundBasicInfo.fragment";

export const userInvestments = (investorId: string): DocumentNode => {
  return gql`
    ${FundStateFragment}
    ${FundBasicInfoFragment}
    query userInvestments {
      account(id: "${investorId}") {
        firstSeen
        investorSince
        investments {
          stateHistory {
            timestamp
            shares
            fundState {
              ...fundStateFragment 
            }
          }
          shares
          fund {
            ...fundBasicInfoFragment
          }
        }
      }
    }
  `;
};
