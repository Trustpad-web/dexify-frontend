import { useState, useEffect } from "react";
import Select, { ItemType } from "../components/Select";
import ChartSkeleton from "../components/Skeleton/ChartSkeleton";
import { formatCurrency, formatNumber } from "../helpers";
import { Button, Carousel } from "flowbite-react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import FundSkeleton from "../components/Skeleton/FundSkeleton";
import FundInvestedCard from "../components/FundInvestedCard";
import UserActionTable from "../components/UserActionTable";
import PerformanceChart, {
  PerformanceData,
} from "../components/PerformanceChart";
import usePortfolio from "../hooks/usePortfolio";
import { useNavigate } from "react-router-dom";

export default function Portfolio() {
  const {
    activities,
    investedFunds,
    roi,
    totalAUM,
    roiHistory,
    roiLoading,
    investorSince,
    loading: activityLoading,
    investor,
  } = usePortfolio();

  const [yearOptions, setYearOptions] = useState<ItemType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getUTCFullYear()
  );
  const navigate = useNavigate();

  const [chartData, setChartData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    setChartData(
      (roiHistory || [])?.filter((roi) => roi.year === selectedYear)
    );
  }, [roiHistory, selectedYear]);

  useEffect(() => {
    const startYear = new Date(investorSince * 1000).getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();
    const _options: ItemType[] = [];
    for (let i = startYear; i <= currentYear; i++) {
      _options.push({
        label: i.toString(),
        value: i,
      });
    }

    setYearOptions(_options);
  }, [investorSince]);

  const handleYearSelected = (value: number) => {
    setSelectedYear(value);
  };

  return (
    <div className="">
      <div className="flex w-full gap-8  flex-col md:flex-row">
        <div className="w-full md:w-[55%] order-2 md:order-1">
          <div className="flex justify-between">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold">
              Your Portfolio
            </h5>
            {investor && (
              <Select
                items={yearOptions}
                value={selectedYear}
                onChange={handleYearSelected}
              />
            )}
          </div>
          {investor && (
            <div className="w-full mt-5 rounded-[12px] bg-white p-3 ">
              {roiLoading ? (
                <ChartSkeleton />
              ) : (
                <PerformanceChart
                  isPercent={true}
                  tooltipPrefix="ROI"
                  data={chartData}
                />
              )}
            </div>
          )}
        </div>
        <div className="bg-primary text-white p-8 rounded-[12px] flex flex-col gap-8 flex-1 mt-8 order-1 md:order-2 max-h-[300px]">
          <div className="flex w-full justify-between items-center">
            <span className="md:text-[16px] text-[14px] font-semibold text-primary_50">
              Total AUM
            </span>
            <span className="md:text-[32px] text-[28px] font-extrabold text-white">
              {formatCurrency(totalAUM)}
            </span>
          </div>

          <div className="flex w-full justify-between items-center">
            <span className="md:text-[16px] text-[14px] font-semibold text-primary_50">
              Return
            </span>
            <span
              className={`${
                (roi || 0) > 0 ? "bg-success" : "bg-danger"
              }  text-white text-md font-bold mr-2 px-2.5 py-0.5 rounded-[20px] dark:bg-yellow-900`}
            >
              {formatNumber((roi || 0) * 100)}%
            </span>
          </div>
        </div>
      </div>
      {investor ? (
        <>
          <div className="mt-8">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold">
              Funds Invested
            </h5>
            <div className="w-[calc(100vw_-_20px)] md:w-[calc(100vw_-_320px_-_60px)] mt-5 md:pl-[20px]">
              <Carousel
                slideInterval={5000}
                indicators={false}
                className="top-funds-carousel"
                leftControl={<LeftControl />}
                rightControl={<RightControl />}
              >
                {activityLoading
                  ? [1, 2, 3, 4].map((item) => <FundSkeleton key={item} />)
                  : investedFunds?.map((fund, index) => (
                      <FundInvestedCard
                        data={fund}
                        key={`fund-overview-${index}`}
                      />
                    ))}
              </Carousel>
            </div>
          </div>
          <div className="mt-8">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold">
              Transaction History
            </h5>
            <div className="w-full mt-5">
              <UserActionTable
                activities={activities || []}
                loading={activityLoading}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center w-full max-w-[300px] mx-auto mt-20 gap-3">
            <h4 className="text-title font-bold border-b-2 border-[#D8D7D8] w-[90%] text-center py-3 border-dashed">
              Invest in Vaults
            </h4>
            <span className="text-description text-sm">Not Invested</span>
            <Button
              color={"white"}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-5 md:mt-10 rounded-[50px] w-full"
              onClick={() => navigate("/all-funds")}
            >
              View All Funds {` `} <HiOutlineChevronRight color="white" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const LeftControl = () => {
  return (
    <div className="p-2 rounded-[50%] bg-[#817c85ba] mb-10">
      <HiOutlineChevronLeft size={24} className="rounded-[50%]" color="white" />
    </div>
  );
};

const RightControl = () => {
  return (
    <div className="p-2 rounded-[50%] bg-[#817c85ba] mb-10">
      <HiOutlineChevronRight
        size={24}
        className="rounded-[50%]"
        color="white"
      />
    </div>
  );
};
