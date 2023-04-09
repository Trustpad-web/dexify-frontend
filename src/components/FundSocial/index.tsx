import { Button } from "flowbite-react";
import { FundActivity } from "../../hooks/useFundActivities";
import Feeds from "./Feeds";
import { HiOutlineShare } from "react-icons/hi";
import Tweets from "./Tweets";

export default function FundSocial({
  manager,
  activities,
  activityLoading,
}: {
  manager: string;
  activities: FundActivity[];
  activityLoading: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex gap-5 items-center mb-4">
        <h3 className="text-title text-[18px] md:text-[24px] font-bold">
          Social
        </h3>
        <Button
          pill={true}
          outline={true}
          className="w-fit bg-primary hover:bg-primary !text-primary hover:!text-white"
        >
          <HiOutlineShare className="mr-2 h-5 w-5" />
          Share Fund
        </Button>
      </div>
      <div className="flex gap-2 w-full flex-col md:flex-row">
        <div className="flex-1 order-2 md:order-1">
          <Feeds activities={activities} loading={activityLoading} />
        </div>
        <div className="md:w-[430px] w-full h-[300px] order-1 md:order-2">
          <Tweets manager={manager} />
        </div>
      </div>
    </div>
  );
}
