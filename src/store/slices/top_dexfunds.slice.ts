import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FundOverview } from "../../@types";
import backendAPI from "../../api";

const initialState: {
    data: FundOverview[],
    loading: boolean
} = {
    data: [],
    loading: true
} ;

export const loadTopDexfunds = createAsyncThunk(
  "topDexfunds/loadTopDexfunds",
  async () => {
    const funds = await backendAPI.fund.getTopFunds();
    return funds;
  }
);

export const topDexfundsSlice = createSlice({
  name: "topDexfunds",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadTopDexfunds.fulfilled,
      (state, action: PayloadAction<FundOverview[]>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
        loadTopDexfunds.pending,
        (state) => {
            state.loading = true;
        }
    );
    builder.addCase(
        loadTopDexfunds.rejected,
        (state) => {
            // state.data = funds;
            state.loading = false
        }
    )
  },
});

export default topDexfundsSlice.reducer;
