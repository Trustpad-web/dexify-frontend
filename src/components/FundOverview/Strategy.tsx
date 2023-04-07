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
      <h3 className="text-title text-[18px] md:text-[24px]"></h3>
      <div className="my-5 bg-primary_light rounded-[12px] p-5 w-full flex flex-wrap items-center gap-6">
        <img src="/imgs/strategy.png" alt="" className="w-[80px] h-[80px]" />
        <span className="text-title font-bold md:text-[20px] text-[16px]">
          Track the Top 10 Projects in crypto with 0 fees!
        </span>
      </div>
    </div>
  );
}
