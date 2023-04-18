import { useState, useEffect } from "react";
import { useTweets } from "../../hooks/useTweets";
import TableRowSkeleton from "../Skeleton/TableRowSkeleton";
import TweetCard, { Tweet } from "./TweetCard";
import { useConnectWallet } from "@web3-onboard/react";
import { twitterLogin } from "../../api/twitter";
import { HiOutlineX } from "react-icons/hi";
import { ReactComponent as TwitterIcon } from "../../assets/imgs/twitter-icon.svg";

export default function Tweets({ manager }: { manager: string }) {
  const { tweets, loading, user } = useTweets(manager);
  const [data, setData] = useState<Tweet[]>();
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    if (user && tweets) {
      const _data: Tweet[] = tweets.map((tweet) => ({
        avatar: user.twitterImage,
        content: tweet.text,
        name: user.twitterScreenName,
        twitterName: user.twitterName,
        timestamp: Math.floor(Number(tweet.id) / 1_000_000),
      }));
      setData(_data);
    }
  }, [tweets, user]);

  const onTwitterLogin = () => {
    localStorage.setItem("twitter_login_location", "account");
    twitterLogin();
  };

  return (
    <div className="w-full">
      <h4 className="text-title text-[16px] md:text-[20px] font-bold mb-3">
        Manager Tweets
      </h4>
      <div className="w-full max-h-screen overflow-y-auto">
        {loading && <TableRowSkeleton />}
        {!loading && tweets && tweets.length > 0 && (
          <ul className="">
            {data?.map((item) => (
              <li>
                <TweetCard tweet={item} />
              </li>
            ))}
          </ul>
        )}
        {!loading && (!tweets || tweets.length === 0) && (
          <div className="relative w-full h-full flex flex-col gap-3 items-center justify-center mt-16">
            <div className="relative">
              <TwitterIcon fill="gray" width={64} height={64} opacity={0.35} />
              <div className="absolute h-7 w-7 flex justify-center items-center bottom-[2px] right-[2px] bg-gray-300 dark:bg-gray-500 rounded-full border-white border-4 dark:border-bg-2-dark">
                <HiOutlineX
                  width={18}
                  color={"gray"}
                  className=" text-gray-400"
                />
              </div>
            </div>
            <p className="font-bold text-lg text-gray-500/50 text-[24px]">
              NO TWEETS
            </p>
            {wallet?.accounts?.[0]?.address === manager &&
              !user?.twitterName && (
                <button
                  onClick={onTwitterLogin}
                  className="mt-5 px-4 py-2 bg-primary_50 dark:bg-blue-900/50 rounded-lg font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-400 dark:hover:bg-blue-900"
                >
                  Connect Twitter
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
