import { gql } from "@apollo/client";
import { PortfolioFragment } from "./portfolio.fragment";

export const FundStateFragment = gql`
  ${PortfolioFragment}
  fragment fundStateFragment on FundState {
      timestamp
      shares {
        timestamp
        totalSupply  
      }
      portfolio {
       ...portfolioFragment
      }
      currencyPrices (where: {currency: "ETH"}) {
        price
      }
  }
`;
