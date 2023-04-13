export const BACKEND_API = process.env.REACT_APP_SERVER || 'http://localhost:3000';
export const SUBGRAPH_SERVER = process.env.REACT_APP_SUBGRAPH_SERVER;

export const PAGE_SIZE = 9;
export const HOLDING_PAGE_SIZE = 5;
export const FEED_PAGE_SIZE = 5;
export const USER_ACTION_PAGE_SIZE = 6;

export const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export const MONTH = 24 * 30 * 3600;