import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FundOverview } from "../../@types";
import { backendInstance } from "../../api/axios";
import { getAllFunds } from "../../api";

const initialState: {
    data: FundOverview[],
    loading: boolean
} = {
    data: [],
    loading: true
} ;

export const loadAllDexfunds = createAsyncThunk(
  "topDexfunds/loadAllDexfunds",
  async () => {
    const funds = await getAllFunds();
    return funds;
  }
);

export const topDexfundsSlice = createSlice({
  name: "topDexfunds",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadAllDexfunds.fulfilled,
      (state, action: PayloadAction<FundOverview[]>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
        loadAllDexfunds.pending,
        (state) => {
            state.loading = true;
        }
    );
    builder.addCase(
        loadAllDexfunds.rejected,
        (state) => {
            // state.data = funds;
            state.loading = false
        }
    )
  },
});

export default topDexfundsSlice.reducer;
