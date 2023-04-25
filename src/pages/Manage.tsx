import { useState, useEffect, Suspense, lazy } from "react";
import { Button, Spinner } from "flowbite-react";
import Select, { ItemType } from "../components/Select";
import ChartSkeleton from "../components/Skeleton/ChartSkeleton";
import { formatCurrency, formatNumber } from "../helpers";
import useManagements from "../hooks/useManagement";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import FundInvestedCard from "../components/FundInvestedCard";
import FundSkeleton from "../components/Skeleton/FundSkeleton";
import { useNavigate } from "react-router-dom";
import TableRowSkeleton from "../components/Skeleton/TableRowSkeleton";
import "../assets/css/home.css";
import CustomCarousel from "../components/Carousel";

const TradeActionTable = lazy(
  async () => import("../components/TradeActionTable")
);
const PerformanceChart = lazy(
  async () => import("../components/PerformanceChart")
);

const MonthlyPerformance = lazy(async () => import('../components/FundOverview/MonthlyPerformance'));


export default function Manage() {
  const {
    managedFunds,
    managerSince,
    loading: fundLoading,
    totalAUM,
    roi,
    historyLoading,
    tradeHistory,
    chartData,
    manager,
  } = useManagements();

  const [yearOptions, setYearOptions] = useState<ItemType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getUTCFullYear()
  );
  const navigate = useNavigate();

  useEffect(() => {
    const startYear = new Date(managerSince * 1000).getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();
    const _options: ItemType[] = [];
    for (let i = startYear; i <= currentYear; i++) {
      _options.push({
        label: i.toString(),
        value: i,
      });
    }

    setYearOptions(_options);
  }, [managerSince]);

  const handleYearSelected = (value: number) => {
    setSelectedYear(value);
  };

  return (
    <div className="">
      <div className="flex w-full gap-8  flex-col md:flex-row">
        <div className="w-full md:w-[55%] order-2 md:order-1">
          {/* <div className="flex justify-between">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold">
              Your Manager Performance
            </h5>
            {manager && (
              <Select
                items={yearOptions}
                value={selectedYear}
                onChange={handleYearSelected}
              />
            )}
          </div> */}
          {manager && (
            <div className="w-full mt-5 rounded-[12px] bg-white p-3 ">
              {fundLoading ? (
                <ChartSkeleton />
              ) : (
                <Suspense fallback={<ChartSkeleton />}>
                  {/* <PerformanceChart
                    tooltipPrefix="Share Price"
                    isPercent={false}
                    data={chartData
                      ?.filter((item) => item.year === selectedYear)
                      .map((item) => ({
                        ...item,
                        performanceBips: item.sharePrice,
                      }))}
                  /> */}
                  <MonthlyPerformance data={chartData
                      .map((item) => ({
                        ...item,
                        aumChangeBips: item.sharePriceBips,
                        sharePriceChangeBips: item.sharePriceBips,
                      }))} />
                </Suspense>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 gap-4 order-1 md:order-2 mt-8">
          <div className="bg-primary text-white p-8 rounded-[12px] flex flex-col gap-8  h-fit">
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
          {manager && (
            <div className="flex flex-col items-center w-full mt-2">
              <h4 className="text-title font-bold border-b-2 border-[#D8D7D8] w-[90%] text-center py-3 border-dashed">
                Manage a Fund
              </h4>
              <Button
                color={"white"}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[50px] w-full"
                onClick={() => navigate("/create-vault")}
              >
                Create New Vault {` `} <HiOutlineChevronRight color="white" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {manager ? (
        <>
          <div className="mt-8">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold mb-5">
              Funds Managed
            </h5>
            <CustomCarousel
              isLeftControlShow={managedFunds.length > 0}
              isRightControlShow={managedFunds.length > 0}
            >
              {fundLoading
                ? [1, 2, 3, 4].map((item) => <FundSkeleton key={item} />)
                : managedFunds?.map((fund, index) => (
                    <FundInvestedCard
                      data={fund}
                      key={`fund-overview-${index}`}
                    />
                  ))}
            </CustomCarousel>
          </div>
          <div className="mt-8">
            <h5 className="text-title text-[16px] md:text-[20px] font-bold">
              Trading History
            </h5>
            <div className="w-full mt-5">
              <Suspense fallback={<TableRowSkeleton />}>
                <TradeActionTable
                  activities={tradeHistory}
                  loading={historyLoading}
                />
              </Suspense>
            </div>
          </div>
        </>
      ) : !fundLoading ? (
        <div className="flex flex-col items-center w-full max-w-[300px] mx-auto mt-20 gap-3">
          <h4 className="text-title font-bold border-b-2 border-[#D8D7D8] w-[90%] text-center py-3 border-dashed">
            Manage a Fund
          </h4>
          <span className="text-description text-sm">Not Created</span>
          <Button
            color={"white"}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-5 md:mt-10 rounded-[50px] w-full"
            onClick={() => navigate("/create-vault")}
          >
            Create New Vault {` `} <HiOutlineChevronRight color="white" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full h-full min-h-[300px] justify-center items-center">
          <Spinner className="w-[32px] h-[32px] fill-primary" />
        </div>
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
