import { useEffect, useState } from "react";
import { Monthly } from "../../@types";
import Select, { ItemType } from "../Select";
import { MONTHS } from "../../constants";
import { useAppSelector } from "../../store";
import { formatNumber } from "../../helpers";

export default function MonthlyPerformance({
  data,
}: {
  data: Monthly[] | undefined;
}) {
  const [selectedYear, setSelectedYear] = useState<number | string>(0);
  const [years, setYears] = useState<ItemType[]>([]);
  const monthlyEthPrices = useAppSelector(
    (state) => state.monthlyEthPrices.data
  );
  const [monthlyPerformanceData, setMonthlyPerformanceData] = useState<
    {
      aumChangeBips: number | undefined;
      sharePriceChangeBips: number | undefined;
    }[]
  >();

  useEffect(() => {
    if (data && monthlyEthPrices) {
      const startYear = data[0].year;
      const startMonth = data[0].month;
      const currnetYear = new Date().getUTCFullYear();
      const currentMonth = new Date().getUTCMonth();
      const _monthlyPerformanceData = [];

      for (let j = 0; j < 12; j++) {
        if (selectedYear === startYear && j < startMonth) {
          _monthlyPerformanceData?.push({
            aumChangeBips: undefined,
            sharePriceChangeBips: undefined,
          });
        } else if (selectedYear === currnetYear && j > currentMonth) {
          _monthlyPerformanceData?.push({
            aumChangeBips: undefined,
            sharePriceChangeBips: undefined,
          });
        } else {
          const serverData = data.find(
            (d) => d.year === selectedYear && d.month === j
          );
          if (serverData) {
            _monthlyPerformanceData?.push({
              aumChangeBips: serverData.aumChangeBips,
              sharePriceChangeBips: serverData.sharePriceChangeBips,
            });
          } else {
            const ethPriceIndex = monthlyEthPrices.findIndex(
              (price) => price.year === selectedYear && price.month === j
            );
            if (ethPriceIndex > 0) {
              const ethPrice = monthlyEthPrices[ethPriceIndex].price;
              const prevEthPrice = monthlyEthPrices[ethPriceIndex - 1].price;
              const bips = (ethPrice - prevEthPrice) / prevEthPrice;
              _monthlyPerformanceData?.push({
                aumChangeBips: bips,
                sharePriceChangeBips: bips,
              });
            } else {
              _monthlyPerformanceData?.push({
                aumChangeBips: undefined,
                sharePriceChangeBips: undefined,
              });
            }
          }
        }
      }
      setMonthlyPerformanceData(_monthlyPerformanceData);
    }
  }, [monthlyEthPrices, selectedYear]);

  useEffect(() => {
    if (data) {
      const _years: ItemType[] = [];
      const startYear = data[0].year;
      const currnetYear = new Date().getUTCFullYear();
      for (let i = startYear; i <= currnetYear; i++) {
        _years.push({
          label: i.toString(),
          value: i,
        });
      }
      setYears(_years);
      setSelectedYear(_years?.[0]?.value);
    }
  }, [setYears, setSelectedYear, data]);

  const handleYearChanged = (value: string | number) => {
    setSelectedYear(value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-title text-[24px] dark:text-white">Performance</h3>
        <Select
          items={years}
          value={selectedYear}
          onChange={handleYearChanged}
        />
      </div>

      <div className="overflow-x-auto w-full mt-3">
        <table className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap  text-center w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {MONTHS.slice(0, 6).map((month) => (
                <th
                  scope="col"
                  className="px-6 py-3 "
                  key={`performance-table-header-${month}`}
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {MONTHS.slice(0, 6).map((_, month) => (
                <td
                  className={`px-6 py-4 font-bold ${
                    (monthlyPerformanceData?.[month].aumChangeBips || 0) > 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {monthlyPerformanceData?.[month].aumChangeBips !== undefined
                    ? `${formatNumber(
                        (monthlyPerformanceData?.[month].aumChangeBips || 0) *
                          100
                      )} %`
                    : "--"}
                </td>
              ))}
            </tr>
            <tr>
              {MONTHS.slice(6).map((month) => (
                <th
                  scope="col"
                  className="px-6 py-3"
                  key={`performance-table-header-${month}`}
                >
                  {month}
                </th>
              ))}
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {MONTHS.slice(6).map((_, month) => (
                <td
                  className={`px-6 py-4 font-bold ${
                    (monthlyPerformanceData?.[month + 6].aumChangeBips || 0) > 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {monthlyPerformanceData?.[month + 6].aumChangeBips !==
                  undefined
                    ? `${formatNumber(
                        (monthlyPerformanceData?.[month + 6].aumChangeBips ||
                          0) * 100
                      )} %`
                    : "--"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
