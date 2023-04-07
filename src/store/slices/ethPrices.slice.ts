import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FundOverview } from "../../@types";
import { backendInstance } from "../../api/axios";
import { getMonthlyEthPrices, getTopFunds } from "../../api";
import { MonthlyEthPrice } from "../../@types/monthly_eth_price";

const initialState: {
    data: MonthlyEthPrice[],
    loading: boolean
} = {
    data: [],
    loading: true
} ;

export const loadMonthlyEthPrices = createAsyncThunk(
  "monthlyEthPrices/loadMonthlyEthPrices",
  async () => {
    const ethPrices = await getMonthlyEthPrices();
    return ethPrices;
  }
);

export const monthlyEthPricesSlice = createSlice({
  name: "monthlyEthPrices",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadMonthlyEthPrices.fulfilled,
      (state, action: PayloadAction<MonthlyEthPrice[]>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
        loadMonthlyEthPrices.pending,
        (state) => {
            state.loading = true;
        }
    );
    builder.addCase(
        loadMonthlyEthPrices.rejected,
        (state) => {
            state.loading = false
        }
    )
  },
});

export default monthlyEthPricesSlice.reducer;
