export const BACKEND_API = process.env.REACT_APP_SERVER || 'http://localhost:3000';
export const SUBGRAPH_SERVER = process.env.REACT_APP_SUBGRAPH_SERVER;

export const PAGE_SIZE = 9;
export const HOLDING_PAGE_SIZE = 5;
export const FEED_PAGE_SIZE = 5;
export const USER_ACTION_PAGE_SIZE = 6;

export const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
export const PerformanceFeeTooltipText = "If enabled, measured based on the vault's performance. The performance fee is subject to a high-water mark. The fee recipient is the vault manager by default, or any other wallet. If you wish to split fee amounts among several wallets"

export const EntranceFeeTooltipText = "If enabled, entrance fees are charged with every new deposit.";

export const ManagementFeeTooltipText = "If enabled, a flat fee measured as an annual percent of total assets under management. The management fee accrues continuously and is automatically paid out with every deposit and redemption. The fee recipient is the vault manager by default, or any other wallet. If you wish to split fee amounts among several wallets";

export const TimeLockTooltipText = "If enabled, it's not allowed to do fund actions - invest, withdraw - in time lock period";
export const MONTH = 24 * 30 * 3600;