import { useEffect, useState } from 'react';
import { getTweetsWithUserInfo } from '../api/twitter';
import { isValidAddress } from '../helpers/web3';

export type Tweet = {
  id: string,
  text: string,
}

export type TwitterUser = {
  twitterName: string,
  twitterScreenName: string,
  twitterImage: string
}

export function useTweets(managerAddr: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [twitterUser, setTwitterUser] = useState<TwitterUser>();

  useEffect(() => {
    if (isValidAddress(managerAddr)) {
      getTweets();
    }

    async function getTweets() {
      try {
        setLoading(true);
        const data = await getTweetsWithUserInfo(managerAddr);
        setTweets(data?.tweets);
        setTwitterUser(data?.user);
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    }
  }, [managerAddr]);

  return { loading, tweets, user: twitterUser };
}
