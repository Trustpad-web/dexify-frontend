import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApolloClient } from "@apollo/client";
import { currencyQuery } from "../../graphql/queries/currency";
import { CurrencyDto } from "../../@types";

const initialState: {
    data: CurrencyDto,
    loading: boolean
} = {
    data: {id: "ETH"},
    loading: true
} ;

export const loadCurrency = createAsyncThunk(
  "assets/loadCurrency",
  async (args: {apolloClient: ApolloClient<object>, id: string}) => {
    const result = await args.apolloClient.query({
        query: currencyQuery(args.id),
      });
    
    return result.data.currency as CurrencyDto;
  }
);

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
        loadCurrency.fulfilled,
      (state, action: PayloadAction<CurrencyDto>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
        loadCurrency.pending,
        (state) => {
            state.loading = true;
        }
    );
    builder.addCase(
        loadCurrency.rejected,
        (state) => {
            // state.data = funds;
            state.loading = false
        }
    )
  },
});

export default currencySlice.reducer;
