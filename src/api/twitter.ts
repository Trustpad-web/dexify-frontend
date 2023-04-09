import axios from "axios";

// const baseUri: string = process.env.REACT_APP_SERVER_URL as string;
const baseUri: string = "https://api.dexify.finance";

export const twitterLogin = () => {
  (async () => {
    try {
      const { data } = await axios.get(`${baseUri}/twitter/auth_link`);
      localStorage.setItem("oauth_token", data.oauth_token);
      localStorage.setItem("oauth_token_secret", data.oauth_token_secret);
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}`;
    } catch (error) {
      console.error(error);
    }
  })();
};

export const saveTwitterUserInfo = async (
  address: string,
  signature: string,
  oauth_verifier: string
) => {
  try {
    const { data } = await axios.post(`${baseUri}/twitter/connect`, {
      address,
      signature,
      oauth_token: localStorage.getItem("oauth_token"),
      oauth_token_secret: localStorage.getItem("oauth_token_secret"),
      oauth_verifier,
    });
    return data;
  } catch (error: any) {
    console.error("Save Twitter User: ", error.response.data);
  }
};

export const logoutUser = async (address: string, signature: string) => {
  try {
    const { data } = await axios.get(`${baseUri}/twitter/disconnect`, {
      params: {
        address,
        signature,
      },
    });
    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_token_secret");
    return data;
  } catch (error: any) {
    console.error("Twitter disconnect: ", error.response.data);
  }
};

export const getTweetsWithUserInfo = async (address: string) => {
  try {
    const { data } = await axios.get(`${baseUri}/twitter/tweets`, {
      params: {
        address,
      },
    });
    return data;
  } catch (error: any) {
    console.error("GET Tweets: ", error.response.data);
  }
};
