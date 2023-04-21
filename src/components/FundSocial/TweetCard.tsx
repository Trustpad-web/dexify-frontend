import { Avatar } from "flowbite-react";
import { formatTime } from "../../helpers/time";

export type Tweet = {
  avatar: string;
  name: string;
  twitterName: string;
  content: string;
  timestamp: number;
};
export default function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="w-full rounded-md bg-white px-4 py-3 border-b-2">
      <Avatar img={tweet.avatar} rounded={true} className="!justify-start">
        <div className="space-y-[3px] font-medium dark:text-white">
          <div>{tweet.twitterName}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            @{tweet.name}
          </div>
        </div>
      </Avatar>
      <div
        className="text-title text-[12px] my-2"
        dangerouslySetInnerHTML={{ __html: tweet.content }}
      />
      <span className="text-description text-[10px]">
        {formatTime(tweet.timestamp / 1000)}
      </span>
    </div>
  );
}
