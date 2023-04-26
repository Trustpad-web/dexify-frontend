import { FundOverviewWithHistoryResponse } from "../../@types";
import { formatNumber } from "../../helpers";
import CustomTooltip from "../Tooltip";

function getRiskFromVolatility(volatility: number) {
  if (volatility < 0.1) {
    return {
      value: 1,
      text: 'This fund has very low risk and suitable for conservative investors.'
    };
  } else if (volatility < 0.2) {
    return {
      value: 2,
      text: 'This fund has low risk and suitable for most investors.'
    };
  } else if (volatility < 0.3) {
    return {
      value: 3,
      text: 'This fund has moderate risk and suitable for investors with a moderate risk tolerance.'
    }
  } else if (volatility < 0.4) {
    return {
      value: 4,
      text: 'This fund has high risk and suitable for a high risk tolerance.'
    }
  } else {
    return {
      value: 5,
      text: 'This fund has very high risk and suitable  for very high risk tolerance.'
    }
  }
}

export default function Strategy({
  fundDetail,
  loading,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
  loading: boolean;
}) {
  const risk = getRiskFromVolatility(fundDetail?.volatility || 0);
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
          <span className="flex items-center">
            <span className="text-success text-[20px]">{risk.value}</span>/
            <span className="text-[14px] mr-1">5</span>
          </span>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <span className="text-[16px] font-medium">Volatility</span>
          <span className="text-[20px] text-secondary font-medium">{formatNumber((fundDetail?.volatility || 0) * 100)}%</span>
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <span className="text-[16px] font-medium">Sharp</span>
          <span className="text-[20px] text-primary font-medium">{formatNumber(fundDetail?.sharpeRatio || 0)}</span>
        </div>
      </div>
    </div>
  );
}
