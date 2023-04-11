import { useState } from "react";
import useFundChartData from "../../hooks/useFundChartData";
import { TimeRange } from "../../@types/timeRange";
import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import { formatTime } from "../../helpers/time";
import Select from "../Select";
import { chartTimeRange } from "./timeRange";
import { formatCurrency } from "../../helpers";
import ChartSkeleton from "../Skeleton/ChartSkeleton";

export default function FundChart({ fundId }: { fundId: string }) {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange["1W"]);
  const { chartData, loading } = useFundChartData(fundId, timeRange);

  const handleTimeRangeChanged = (value: TimeRange) => {
    setTimeRange(value);
  };

  const getXLabel = (content: string, timeRange: TimeRange): string => {
    let options: Intl.DateTimeFormatOptions;
    switch (timeRange) {
      case TimeRange["1D"]:
        options = {
          hour: "numeric",
          minute: "numeric",
        };
        break;
      case TimeRange["1W"]:
        options = {
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
        };
        break;
      case TimeRange["1M"]:
        options = {
          month: "numeric",
          day: "numeric",
        };
        break;
      case TimeRange["3M"]:
        options = {
          month: "numeric",
          day: "numeric",
        };
        break;
      case TimeRange["6M"]:
        options = {
          month: "numeric",
          day: "numeric",
        };
        break;
      case TimeRange["1Y"]:
        options = {
          month: "numeric",
          day: "numeric",
        };
        break;
      case TimeRange["ALL"]:
        options = {
          month: "numeric",
          day: "numeric",
        };
        break;
      default:
        options = {
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
        };
        break;
    }
    return formatTime(Math.ceil(new Date(content).getTime() / 1000), options);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: { time: string; value: number }[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-md p-3 bg-white">
          <p className="label">{`${label}`}</p>
          <p className="desc">
            Share price: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  };

  const tickFormatter = (value: any, index: number) => {
    return getXLabel(value, timeRange);
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h4 className="text-title text-[16px] md:text-[20px] font-bold">
          Share Price Chart
        </h4>
        <Select
          items={chartTimeRange}
          value={TimeRange["1W"]}
          onChange={handleTimeRangeChanged}
        />
      </div>
      <div className="w-full h-[500px] rounded-[12px] bg-white mt-4">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={chartData?.timeHistory?.map((time, index) => ({
                time: formatTime(time),
                value: chartData.sharePriceHistory?.[index],
              }))}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 30,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CB6CE6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="time"
                angle={-30}
                tickFormatter={tickFormatter}
                fontSize={10}
                padding={{ right: 10 }}
              />
              <YAxis />
              {/* @ts-ignore */}
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#CB6CE6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
