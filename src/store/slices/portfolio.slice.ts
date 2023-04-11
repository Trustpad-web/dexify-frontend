import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApolloClient } from "@apollo/client";
import { investmentShareHistoryPerInvestorQuery } from "../../graphql/queries/investmentSharesHistoryPerInvester";
import { AccountDto } from "../../@types/account";
import { store } from "..";
import { MonthlyEthPrice } from "../../@types/monthly_eth_price";
import { HoldingDto } from "../../@types";
export type MonthlyPortfolioData = {
  aumHistory: any[];
};

const initialState: {
  monthlyPortfolioData: MonthlyPortfolioData;
  loading: boolean;
} = {
  monthlyPortfolioData: {
    aumHistory: [],
  },
  loading: true,
};
// fundAddress: [{
//   timestamp: string,
//   shares: string,
//   totalShares: string,
//   aum: string,
// }]

type DataPerFund = {
  [key: string]: {
    changes?: {
      timestamp: number;
      shares: number;
      totalShares: number;
      aum: number;
    }[];
    name?: string;
    redeemedAmount?: number;
    investedAmount?: number;
    holdingAmount?: number;
    holdings?: HoldingDto[];
  };
};

const constructMonthlyPortfolioData = (data: AccountDto) => {
  const investorSince = Number(data.investorSince);
  const monthlyEthPrices = store.getState().monthlyEthPrices.data;

  const startYear = new Date(investorSince * 1000).getUTCFullYear();
  const startMonth = new Date(investorSince * 1000).getUTCMonth();
  const currentYear = new Date().getUTCFullYear();
  const currentMonth = new Date().getUTCMonth();

  const currentEthPrice = monthlyEthPrices.find(
    (item) => item.year === currentYear && item.month === currentMonth
  );

  let accShares: {
    [key: string]: number;
  } = {};

  let dataPerFund: DataPerFund = {};
  data.investmentSharesChanges?.map((investmentSharesChange) => {
    const fundId = investmentSharesChange.fund.id;
    if (!dataPerFund[fundId]) {
      dataPerFund[fundId] = { name: investmentSharesChange.fund.name };
    }
    if (!dataPerFund[fundId].changes) {
      dataPerFund[fundId].changes = [];
    }
    if (!dataPerFund[fundId].holdings) {
      dataPerFund[fundId].holdings =
        investmentSharesChange.fund.portfolio.holdings;
    }
    const { timestamp, shares, type, fundState } = investmentSharesChange;

    const { shares: totalShares, currencyPrices, portfolio } = fundState;

    let aum =
      portfolio?.holdings.reduce(
        (curr, current) =>
          curr + Number(current.amount) * Number(current.price.price),
        0
      ) || 0;
    aum *= Number(currencyPrices?.[0].price);

    const amountChanged = Number(totalShares?.totalSupply)
      ? (Number(shares) / Number(totalShares?.totalSupply)) * aum
      : 0;

    if (type === "SharesBought") {
      accShares[fundId] = Number(accShares[fundId] || 0) + Number(shares);
      dataPerFund[fundId].investedAmount =
        Number(dataPerFund[fundId].investedAmount || 0) + amountChanged;
    } else {
      accShares[fundId] = Number(accShares[fundId] || 0) - Number(shares);
      dataPerFund[fundId].redeemedAmount =
        Number(dataPerFund[fundId].redeemedAmount || 0) + amountChanged;
    }

    dataPerFund[fundId]?.changes?.push({
      timestamp: Number(timestamp),
      aum,
      shares: accShares[fundId],
      totalShares: Number(totalShares?.totalSupply),
    });
  });

  const result = [];
  for (let i = startYear; i <= currentYear; i++) {
    for (let j = 0; j < 12; j++) {
      if (i === startYear && j < startMonth) continue;
      if (i === currentYear && j >= currentMonth) break;
      const timestamp = Math.ceil(new Date(`${i}-${j + 1}`).getTime() / 1000);
      const aum = getAUMAt(dataPerFund, timestamp, monthlyEthPrices);
      result.push({
        year: i,
        month: j,
        aum,
      });
    }
  }

  Object.entries(dataPerFund).map(([addr, data]) => {
    const holdingAmount = data.holdings?.reduce(
      (curr, cur) =>
        curr + Number(cur.amount || 0) * Number(cur.asset.price?.price || 0),
      0
    );
    const lastData = data.changes?.[data.changes?.length - 1];
    dataPerFund[addr].holdingAmount = lastData?.totalShares
      ? ((holdingAmount || 0) *
          (currentEthPrice?.price || 0) *
          (lastData?.shares || 0)) /
        lastData?.totalShares
      : 0;
  });

  result.push({
    year: currentYear,
    month: currentMonth,
    aum: Object.entries(dataPerFund).reduce(
      (curr, [fundAddrr, data]) => curr + (data?.holdingAmount || 0),
      0
    ),
  });

  console.log("DataPerFund: ", dataPerFund, result);
};

const getAUMAt = (
  dataPerFund: DataPerFund,
  timestamp: number,
  monthlyEthPrices: MonthlyEthPrice[]
) => {
  const year = new Date(timestamp * 1000).getUTCFullYear();
  const month = new Date(timestamp * 1000).getUTCMonth();
  const ethPrice = monthlyEthPrices.find(
    (item) => item.year === year && item.month === month
  );
  const result: (
    | {
        timestamp?: number;
        shares?: number;
        totalShares?: number;
        aum?: number;
      }
    | undefined
  )[] = [];

  Object.entries(dataPerFund).map(([fundAddress, fundData]) => {
    const data = fundData.changes
      ?.reverse()
      .find((item) => timestamp + 30 * 24 * 3600 * 1000 >= item.timestamp);
    const _year = new Date((data?.timestamp || 0) * 1000).getUTCFullYear();
    const _month = new Date((data?.timestamp || 0) * 1000).getUTCMonth();

    if (year === _year && month === _month) {
      result.push({
        ...data,
        aum: data?.totalShares
          ? (data?.aum * data?.shares) / data?.totalShares
          : 0,
      });
    } else {
      const _ethPrice = monthlyEthPrices.find(
        (item) => item.year === _year && item.month === _month
      );
      const _aum = data?.totalShares
        ? (data?.aum * data?.shares) / data?.totalShares
        : 0;
      result.push({
        ...data,
        aum: ethPrice?.price
          ? (_aum * (_ethPrice?.price || 1)) / ethPrice?.price
          : 0,
      });
    }
  });

  const aum = result.reduce((curr, cur) => curr + (cur?.aum || 0), 0);

  return aum;
};

export const loadMonthlyPortfolioData = createAsyncThunk(
  "monthlyPortfolio/loadMonthlyPortfolioData",
  async (args: { apolloClient: ApolloClient<object>; id: string }) => {
    const result = await args.apolloClient.query({
      query: investmentShareHistoryPerInvestorQuery(args.id),
    });

    const accountData = result.data.account as AccountDto;
    constructMonthlyPortfolioData(accountData);
    return [];
  }
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadMonthlyPortfolioData.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.monthlyPortfolioData = {
          ...state.monthlyPortfolioData,
          aumHistory: action.payload,
        };
        state.loading = false;
      }
    );
    builder.addCase(loadMonthlyPortfolioData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadMonthlyPortfolioData.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default portfolioSlice.reducer;
