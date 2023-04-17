import { useEffect, useState } from "react";
import { Avatar, Button } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../../@types";
import { HiDocumentRemove, HiOutlinePencil } from "react-icons/hi";

export default function FundEdit({
  fundDetail,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
}) {
  const [fundName, setFundName] = useState<string>(fundDetail?.name || "");
  const [performanceFee, setPerformanceFee] = useState<number>(0);
  const [endtryFee, setEntryFee] = useState<number>(0);
  const [minInvestment, setMinInvestment] = useState<number>(0);
  const [maxInvestment, setMaxInvestment] = useState<number>(0);

  return (
    <div className="mt-10">
      <div className="flex w-fit gap-5">
        <img
          src={"/imgs/logo.png"}
          className="rounded-[50%] w-[64px] h-[64px] md:w-[100px] md:h-[100px]"
        />
        <div className="max-w-[300px] flex flex-col gap-3">
          <Button
            pill={true}
            outline={true}
            className="w-full bg-primary hover:bg-primary flex justify-between text-primary"
          >
            <HiOutlinePencil className="mr-3" />
            Change Fund Image
          </Button>
          <Button
            outline={true}
            pill={true}
            className="w-full bg-primary hover:bg-primary flex justify-between"
          >
            <HiDocumentRemove className="mr-3" />
            Remove
          </Button>
        </div>
      </div>
      <div className="mt-10 gap-3">
          <div className="flex flex-col gap-2 max-w-[300px]">
            <label htmlFor="" className="text-description">
              Dexfund Name
            </label>
            <input
              className="text-title font-bold focus:border-[#333002] outline-none rounded-[12px] bg-white border-[1px] py-3 px-5 w-full"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 max-w-[300px]">
            <label htmlFor="" className="text-description">
              Performance Fee
            </label>
            <input
              className="text-title font-bold focus:border-[#333002] outline-none rounded-[12px] bg-white border-[1px] py-3 px-5 w-full"
              value={performanceFee}
              type="number"
              onChange={(e) => setPerformanceFee(Number(e.target.value))}
            />
          </div>
      </div>
    </div>
  );
}
