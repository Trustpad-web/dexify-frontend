import { DocumentNode, gql } from "@apollo/client/core";
import { FundStateFragment } from "./fragments/fundState.fragment";
import { PortfolioFragment } from "./fragments/portfolio.fragment";

export const investmentShareHistoryPerInvestorQuery = (
  id: string
): DocumentNode => {
  return gql`
    ${FundStateFragment}
    ${PortfolioFragment}
    query account {
      account(id: "${id}") {
        id
        firstSeen
        investorSince
        investmentSharesChanges(orderby: timestamp, orderDirection: asc) {
          timestamp
          fund {
            id
            name
            portfolio {
            ...portfolioFragment
            }
          }
          shares
          type
          fundState {
            ...fundStateFragment
          }
        }
      }
    }
  `;
};
