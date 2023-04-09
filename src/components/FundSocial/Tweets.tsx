import { useState, useEffect } from "react";
import { useTweets } from "../../hooks/useTweets";
import TableRowSkeleton from "../Skeleton/TableRowSkeleton";
import TweetCard, { Tweet } from "./TweetCard";

export default function Tweets({ manager }: { manager: string }) {
  const { tweets, loading, user } = useTweets(manager);
  const [data, setData] = useState<Tweet[]>();

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

  return (
    <div className="w-full">
      <h4 className="text-title text-[16px] md:text-[20px] font-bold mb-3">
        Manager Tweets
      </h4>
      <div className="w-full">
        {loading ? (
          <TableRowSkeleton />
        ) : (
          <ul className="">
            {data?.map((item) => (
              <li>
                <TweetCard tweet={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
