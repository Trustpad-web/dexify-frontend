import { useState, useRef } from "react";
import { Button, Tabs, TabsRef } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../@types";
import { MANAGE_MENU } from "../../constants/fund_menu";
import FundStake from "./FundStake";
import FundTrade from "./FundTrade";
import FundEdit from "./FundEdit";

export default function FundManage({
  fundDetail,
  loading,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabsRef = useRef<TabsRef>(null);

  return (
    <div className="">
      <div className="flex justify-between items-center w-full">
        <h4 className="text-title font-bold text-[20px] md:text-[24px]">{MANAGE_MENU[activeTab]}</h4>
        <div className="w-fit overflow-auto">
          <Button.Group className="w-full">
            {MANAGE_MENU.map((item, index) => (
              <Button
                color="gray"
                className={
                  `focus:ring-transparent focus:text-white hover:text-primary focus:bg-primary ` +
                  (activeTab === index
                    ? "!bg-primary !text-white"
                    : "!bg-white")
                }
                onClick={() => tabsRef.current?.setActiveTab(index)}
                key={`fund-tab-${index}`}
              >
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
        <Tabs.Item title="">
          <FundTrade fundDetail={fundDetail} />
        </Tabs.Item>
        <Tabs.Item title="">
          <FundStake fundDetail={fundDetail} />
        </Tabs.Item>
        <Tabs.Item title="">
          <FundEdit fundDetail={fundDetail} />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
