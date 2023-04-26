export const BACKEND_API =
  process.env.REACT_APP_SERVER || "http://localhost:3000";
export const SUBGRAPH_SERVER = process.env.REACT_APP_SUBGRAPH_SERVER;

export const PAGE_SIZE = 9;
export const HOLDING_PAGE_SIZE = 5;
export const FEED_PAGE_SIZE = 5;
export const USER_ACTION_PAGE_SIZE = 6;

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const PerformanceFeeTooltipText = `A performance fee is a fee charged on the profits of the fund. It is paid out when fund investors withdraw their investment, and it incentivizes fund managers to work hard to increase the value of the fund.Average performance fees are 10-20%.`;

export const EntranceFeeTooltipText =
  "If enabled, entrance fees are charged with every new deposit.";

export const ManagementFeeTooltipText = `The management fee is a yearly fee that is paid to a manager on a quarterly basis, and typically ranges from 0% to 2.5%, with an average fee of 1.19%. 

This fee covers the cost of managing the fund, and is calculated based on the assets under management (AUM) of the fund. The management fee accrues continuously and is automatically paid out with every deposit and redemption`;

export const TimeLockTooltipText =
  "If enabled, it's not allowed to do fund actions - invest, withdraw - in time lock period";

export const DescriptionTooltipText =
  "A chance to write about your funds’ strategy. e.g. “Tracking the top projects on the Venom and Base blockchains, based on TVL”";

export const FundImageTooltipText =
  "This image captures the attention of users, and makes your fund stand out from the crowd! Use a picture related to your fund, or create a personal cover in ‘Canva’. Optimal ratio is 1000x600.";

export const MinInvestmentTooltipText = `The minimum amount required to invest in this Fund.`;

export const MONTH = 24 * 30 * 3600;
