import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssetDto } from "../../@types";
import { getAllFunds } from "../../api";
import { ApolloClient } from "@apollo/client";
import { assetsQuery } from "../../graphql/queries/assets";
import { RootState } from "..";

const initialState: {
    data: AssetDto[],
    loading: boolean
} = {
    data: [],
    loading: true
} ;

export const loadAllAssets = createAsyncThunk(
  "assets/loadAllAssets",
  async (apolloClient: ApolloClient<object>) => {
    const result = await apolloClient.query({
        query: assetsQuery(),
      });
    
    return result.data.assets as AssetDto[];
  }
);

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      loadAllAssets.fulfilled,
      (state, action: PayloadAction<AssetDto[]>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
        loadAllAssets.pending,
        (state) => {
            state.loading = true;
        }
    );
    builder.addCase(
        loadAllAssets.rejected,
        (state) => {
            // state.data = funds;
            state.loading = false
        }
    )
  },
});

export const getAsset = (state: RootState, id: string) => {
  const asset = state.assets.data.find(item => item.id.toLowerCase() === id.toLowerCase());
  return asset;
}

export default assetsSlice.reducer;
