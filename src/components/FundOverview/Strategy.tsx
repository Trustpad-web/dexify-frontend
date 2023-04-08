import { Card } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../@types";

export default function Strategy({
  fundDetail,
  loading,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
  loading: boolean;
}) {
  return (
    <div className="">
      <h3 className="text-title text-[18px] md:text-[24px] font-bold">Strategy</h3>
      <div className="my-5 bg-primary_light rounded-[12px] p-5 w-full flex flex-wrap items-center gap-6">
        <img src="/imgs/strategy.png" alt="" className="w-[80px] h-[80px]" />
        <span className="text-title font-bold md:text-[20px] text-[16px]">
          Track the Top 10 Projects in crypto with 0 fees!
        </span>
      </div>
      <div className="flex rounded-[12px] p-5 bg-white w-full mt-10">
        <div className="flex flex-col flex-1 text-description gap-3">
          <span className="text-[16px] font-medium">Risk</span>
          <span className="">
            <span className="text-success text-[20px]">1</span>/
            <span className="text-[14px]">5</span>
          </span>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <span className="text-[16px] font-medium">Volatility</span>
          <span className="text-[20px] text-secondary font-medium">78.87%</span>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <span className="text-[16px] font-medium">Sharp</span>
          <span className="text-[20px] text-primary font-medium">1.56</span>
        </div>
      </div>
    </div>
  );
}
