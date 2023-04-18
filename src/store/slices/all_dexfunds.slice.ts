import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FundMeta, FundOverview } from "../../@types";
import backendAPI from "../../api";

const initialState: {
  data: FundOverview[];
  meta: FundMeta[];
  loading: boolean;
} = {
  data: [],
  meta: [],
  loading: true,
};

export const loadAllDexfunds = createAsyncThunk(
  "allDexfunds/loadAllDexfunds",
  async () => {
    const funds = await backendAPI.fund.getAllFunds();
    return funds;
  }
);

export const loadFundMeta = createAsyncThunk(
  "allDexfunds/loadAllFundMeta", 
  async () => {
    const fundMeta = await backendAPI.fund.getAllFundsMeta();
    return fundMeta;
  }
)

export const allDexfundsSlice = createSlice({
  name: "allDexfunds",
  initialState,
  reducers: {
    addFund: (state, action: PayloadAction<FundOverview>) => {
      const newData = state.data;
      newData.push(action.payload);
      state = {
        ...state,
        data: newData,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(
      loadAllDexfunds.fulfilled,
      (state, action: PayloadAction<FundOverview[]>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(loadAllDexfunds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllDexfunds.rejected, (state) => {
      // state.data = funds;
      state.loading = false;
    });
    builder.addCase(loadFundMeta.fulfilled, (state, action: PayloadAction<FundMeta[]>) => {
      state.meta = action.payload;
    })
  },
});
export const { addFund } = allDexfundsSlice.actions;
export default allDexfundsSlice.reducer;
