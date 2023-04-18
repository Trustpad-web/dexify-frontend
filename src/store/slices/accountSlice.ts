import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import serverAPIs from '../../api'
import { ethers } from 'ethers';
import { signMessage } from '../../helpers/web3';
import notification from '../../helpers/notification';


const initialUser: User = {
  title: '',
  image: '',
  id: '',
  name: '',
  bio: '',
  address: '',
  email: '',
  twitterName: '',
  twitterScreenName: '',
  twitterImage: '',
};

const initialState: AccountState = {
  user: initialUser,
  loading: false,
};

export const getMyAccount = createAsyncThunk(
  'user/get',
  async (address: string, { rejectWithValue }) => {
    try {
      const result = await serverAPIs.user.getUser(address);
      return result;
    } catch (error) {
      return rejectWithValue('');
    }
  },
);

export const createOrUpdateMyAccount = createAsyncThunk(
  'user/post',
  async (
    postInfo: {
      signer: ethers.Signer;
      file: File | undefined;
      newAccount: User;
    },
    { rejectWithValue },
  ) => {
    try {
      const { signature, address } = await signMessage(
        postInfo.signer,
      );
      const result = await serverAPIs.user.postUser(
        signature,
        address,
        postInfo.file,
        postInfo.newAccount,
      );
      notification.success(
        'Success',
        'Your account details have been saved.',
      );
      return result;
    } catch (error: any) {
      const err = error?.reason?.split(':');
      const errorTitle = err ? err[0].toUpperCase() : error.message;
      notification.danger(
        errorTitle,
        error?.reason?.slice(errorTitle.length + 1),
      );
      return rejectWithValue('');
    }
  },
);

export const logoutTwitterUser = createAsyncThunk(
  'twitter/get',
  async (signer: ethers.Signer, { rejectWithValue }) => {
    try {
      const { signature, address } = await signMessage(signer);
      const result = await serverAPIs.twitter.logoutUser(address, signature);
      notification.success(
        'Success',
        'Your twitter account have been disconnected.',
      );
      return result;
    } catch (error: any) {
      const err = error?.reason?.split(':');
      const errorTitle = err ? err[0].toUpperCase() : error.message;
      notification.danger(
        errorTitle,
        error?.reason?.slice(errorTitle.length + 1),
      );
      return rejectWithValue('');
    }
  },
);

export const updateMyAccountWithTwitter = createAsyncThunk(
  'twitter/post',
  async (
    postInfo: {
      signer: ethers.Signer;
      oauth_verifier: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { signature, address } = await signMessage(
        postInfo.signer
      );
      const result = await serverAPIs.twitter.saveTwitterUserInfo(
        address,
        signature,
        postInfo.oauth_verifier,
      );
      if (!result) return rejectWithValue('');
      return result;
    } catch (error: any) {
      const err = error?.reason?.split(':');
      const errorTitle = err
        ? err[0].toUpperCase()
        : error.response.data.message;
      notification.danger(
        errorTitle,
        error?.reason?.slice(errorTitle.length + 1),
      );
      return rejectWithValue('');
    }
  },
);

export const myAccountSlice = createSlice({
  name: 'myAccount',
  initialState,
  reducers: {
    setMyAccountAsDefault: (state) => {
      state.user = initialUser;
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getMyAccount.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
    );
    builder.addCase(getMyAccount.rejected, (state) => {
      state.user = initialUser;
    });

    builder.addCase(createOrUpdateMyAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrUpdateMyAccount.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(createOrUpdateMyAccount.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateMyAccountWithTwitter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateMyAccountWithTwitter.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateMyAccountWithTwitter.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(logoutTwitterUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutTwitterUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(logoutTwitterUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setMyAccountAsDefault } = myAccountSlice.actions;

export default myAccountSlice.reducer;
