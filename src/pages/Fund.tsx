import { useEffect, useState, useRef, Suspense, lazy } from "react";
import CustomBreadcrumbs, { BreadCrumbPath } from "../components/Breadcrumbs";
import useFundDetails from "../hooks/useFundDetails";
import SingleSkeleton from "../components/Skeleton/SingleSkeleton";
import { Button, Tabs, TabsRef } from "flowbite-react";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useConnectWallet } from "@web3-onboard/react";
import useFundActivities from "../hooks/useFundActivities";
import { TimeRange } from "../@types/timeRange";
import { FUND_MENU } from "../constants/fund_menu";
import LoadingScreen from "../layouts/LoadingScreen";
import '../assets/css/fund.css';

const FundOverview = lazy(async () => import("../components/FundOverview"));
const FundPortfolio = lazy(async () => import("../components/FundPortfolio"));
const FundFee = lazy(async () => import("../components/FundFee"));
const FundSocial = lazy(async () => import("../components/FundSocial"));
const FundChart = lazy(async () => import("../components/FundChart"));
const FundManage = lazy(async () => import("../components/FundManage"));

export default function Fund() {
  const { fund, loading } = useFundDetails(TimeRange["1W"]);
  const [path, setPath] = useState<BreadCrumbPath[]>();

  const tabsRef = useRef<TabsRef>(null);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const { activities, loading: activityLoading } = useFundActivities(
    fund?.id || "0x",
    fund?.accessor?.denominationAsset
  );

  const isManager = fund?.manager?.id === wallet?.accounts?.[0]?.address;
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    if (fund) {
      setPath([
        {
          title: "Home",
          href: "/",
        },
        {
          title: fund.name || "",
          href: "/",
        },
      ]);
    }
  }, [fund]);

  return (
    <div className="fund-details">
      {loading ? <SingleSkeleton /> : <CustomBreadcrumbs path={path || []} />}
      <div className="my-5 bg-primary_light rounded-[12px] p-3 w-full flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-fit">
          <img
            src={fund?.image || "/imgs/fund/0.png"}
            alt=""
            className="w-full h-auto md:w-[100px] md:h-[70px] rounded-[12px]"
          />
          <h5 className="text-title dark:text-white text-[14px] md:text-[16px] font-bold p-3 h-fit bg-white dark:bg-gray-700 md:-ml-7 rounded-[12px] mb-0">
            {fund?.name}
          </h5>
        </div>
        <div className="w-full md:w-fit overflow-auto">
          <Button.Group className="w-full">
            {FUND_MENU.map((item, index) => (
              <Button
                color="gray"
                className={
                  `focus:ring-transparent focus:text-white hover:text-primary focus:bg-primary ` +
                  (activeTab === index
                    ? "!bg-primary !text-white"
                    : "!bg-white") +
                  (!isManager && index === 0 ? " hidden" : "")
                }
                onClick={() => tabsRef.current?.setActiveTab(index)}
                key={`fund-menu-${index}`}
              >
                <HiOutlineViewGrid className="mr-3 h-4 w-4" />
                {item}
              </Button>
            ))}
          </Button.Group>
        </div>
      </div>
      <Tabs.Group
        aria-label="Default tabs"
        style="default"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item title="" hidden={!isManager}>
          <Suspense fallback={<LoadingScreen />}>
            {isManager && <FundManage fundDetail={fund} loading={loading} />}
          </Suspense>
        </Tabs.Item>
        <Tabs.Item active title="">
          <Suspense fallback={<LoadingScreen />}>
            <FundOverview
              fundDetail={fund}
              loading={loading}
              userActivities={
                activities?.filter(
                  (activity) =>
                    activity.investor === wallet?.accounts?.[0].address
                ) || []
              }
            />
          </Suspense>
        </Tabs.Item>
        <Tabs.Item title="">
          <Suspense fallback={<LoadingScreen />}>
            <FundPortfolio fundDetail={fund} loading={loading} />
          </Suspense>
        </Tabs.Item>
        <Tabs.Item title="">
          <Suspense fallback={<LoadingScreen />}>
            <FundFee id={fund?.id || "0x0"} />
          </Suspense>
        </Tabs.Item>
        <Tabs.Item title="">
          <Suspense fallback={<LoadingScreen />}>
            <FundSocial
              manager={fund?.manager?.id || "0x"}
              activities={activities || []}
              activityLoading={activityLoading}
            />
          </Suspense>
        </Tabs.Item>
        <Tabs.Item title="">
          <Suspense fallback={<LoadingScreen />}>
            <FundChart fundId={fund?.id || "0x"} />
          </Suspense>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
