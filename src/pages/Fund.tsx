import { useEffect, useState, useRef } from "react";
import CustomBreadcrumbs, { BreadCrumbPath } from "../components/Breadcrumbs";
import useFundDetails from "../hooks/useFundDetails";
import SingleSkeleton from "../components/Skeleton/SingleSkeleton";
import { Button, Tabs, TabsRef } from "flowbite-react";
import {
  HiOutlineChartPie,
  HiOutlineChartSquareBar,
  HiOutlineClock,
  HiOutlineViewGrid,
  HiUsers,
} from "react-icons/hi";
import FundOverview from "../components/FundOverview";

export default function Fund() {
  const { fund, loading } = useFundDetails("1W");
  const [path, setPath] = useState<BreadCrumbPath[]>();

  const [activeTab, setActiveTab] = useState<number>(0);
  const tabsRef = useRef<TabsRef>(null);

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
            src="/imgs/fund/0.png"
            alt=""
            className="w-full h-auto md:w-[100px] md:h-[80px] rounded-[12px]"
          />
          <h5 className="text-title dark:text-white text-[14px] md:text-[16px] font-bold p-3 h-fit bg-white dark:bg-gray-700 md:-ml-7 rounded-[12px] mb-0">
            {fund?.name}
          </h5>
        </div>
        <div className="w-full md:w-fit overflow-auto">
          <Button.Group className="w-full">
            {["Overview", "Portfolio", "Fees", "Social", "Chart"].map(
              (item, index) => (
                <Button
                  color="gray"
                  className={
                    `focus:ring-transparent focus:text-white hover:text-primary focus:bg-primary ` +
                    (activeTab === index ? "!bg-primary !text-white" : "!bg-white")
                  }
                  onClick={() => tabsRef.current?.setActiveTab(index)}
                >
                  <HiOutlineViewGrid className="mr-3 h-4 w-4" />
                  {item}
                </Button>
              )
            )}
          </Button.Group>
        </div>
      </div>
      <Tabs.Group
        aria-label="Default tabs"
        style="default"
        ref={tabsRef}
        onActiveTabChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.Item active title="">
          <FundOverview fundDetail={fund} loading={loading} />
        </Tabs.Item>
        <Tabs.Item title="">Dashboard content</Tabs.Item>
        <Tabs.Item title="">Settings content</Tabs.Item>
        <Tabs.Item title="">Contacts content</Tabs.Item>
        <Tabs.Item title="">Chart content</Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
