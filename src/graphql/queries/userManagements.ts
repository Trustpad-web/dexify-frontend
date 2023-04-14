import { DocumentNode, gql } from "@apollo/client/core";
import { FundBasicInfoFragment } from "./fragments/fundBasicInfo.fragment";
import { PortfolioFragment } from "./fragments/portfolio.fragment";

export const userManagements = (managerId: string): DocumentNode => {
  return gql`
    ${FundBasicInfoFragment}
    ${PortfolioFragment}
    query userInvestments {
        account(id:"${managerId}") {
            manager
            managerSince
            managements {
                ...fundBasicInfoFragment
                investmentCount
                stateHistory(orderBy: timestamp, orderDirection:asc) {
                    timestamp
                    shares {
                        timestamp
                        totalSupply
                    }
                    currencyPrices(where: {currency:"ETH"}) {
                        timestamp
                        price
                    }
                    portfolio {
                        ...portfolioFragment
                    }
                }
            }
        }
    }
  `;
};
