import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MONTHS } from "../../constants";
import useMediaQuery from "../../hooks/useMediaQuery";
import { formatCurrency, formatNumber } from "../../helpers";

export type PerformanceData = {
  year: number;
  month: number;
  performanceBips: number;
};

export default function PerformanceChart({
  data,
  tooltipPrefix,
  isPercent,
}: {
  data: PerformanceData[];
  tooltipPrefix: string;
  isPercent: boolean;
}) {
  const matches = useMediaQuery("(max-width: 768px)");

  const ticketFormatter = (value: number, index: number) => {
    return MONTHS[index];
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
          <p className="label text-[12px]">{`${MONTHS[Number(label)]}`}</p>
          <p className="desc text-[12px]">
            {tooltipPrefix}:{" "}
            {isPercent
              ? `${formatNumber(payload[0].value)}%`
              : `${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-[200px] md:h-[300px] overflow-x-auto">
      <ResponsiveContainer width="100%" minWidth={320} height="100%">
        <BarChart
          width={matches ? 320 : 500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="3%" stopColor="#8C52FF" stopOpacity={0.9} />
              <stop offset="97%" stopColor="#8C52FF" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tickFormatter={ticketFormatter}
            fontSize={matches ? 8 : 12}
          />
          <YAxis width={matches ? 20 : 30} fontSize={matches ? 8 : 12} />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#8C52FF00" />
          <Bar
            dataKey="performanceBips"
            fill="url(#colorUv)"
            barSize={matches ? 10 : 24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
