import { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../@types";
import FundSkeleton from "../Skeleton/FundSkeleton";
import MonthlyPerformance from "./MonthlyPerformance";
import { formatCurrency } from "../../helpers";
import useERC20 from "../../hooks/useERC20";
import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, BigNumberish, utils } from "ethers";
import Strategy from "./Strategy";

export default function FundOverview({
  fundDetail,
  loading,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
  loading: boolean;
}) {
  const [myDeposits, setMyDeposits] = useState<BigNumber>(BigNumber.from(0));
  const [{ wallet, connecting }] = useConnectWallet();

  const { getBalance } = useERC20(fundDetail?.id || "");

  useEffect(() => {
    (async function () {
      if (fundDetail && wallet) {
        const balance = await getBalance(wallet.accounts[0].address);
        if (fundDetail.totalShares) {
          const deposits = balance
            .mul(utils.parseEther((fundDetail.aum || 0).toString()))
            .div(utils.parseEther(fundDetail.totalShares.toString()));
          setMyDeposits(deposits);
        }
      }
    })();
  }, [fundDetail, wallet, getBalance]);
  return (
    <div className="mt-3 gap-3 w-full">
      <div className="flex gap-10 flex-col md:flex-row">
        <div className="performance flex w-full md:w-[60%]">
          {loading ? (
            <FundSkeleton />
          ) : (
            <MonthlyPerformance data={fundDetail?.monthlyStates} />
          )}
        </div>
        <div className="flex flex-col flex-1 gap-6">
          <div className="btn-actions flex justify-between">
            <Button
              pill={true}
              outline={true}
              className="w-[45%] bg-primary hover:bg-primary"
            >
              Invest
            </Button>
            <Button
              pill={true}
              className="w-[45%] bg-primary hover:bg-white dark:hover:bg-gray-500 hover:text-primary border-primary"
            >
              Withdraw
            </Button>
          </div>
          <div className="bg-primary text-white p-5 rounded-[12px] flex flex-col gap-4">
            <div className="flex w-full justify-between items-center">
              <span className="md:text-[16px] text-[14px] font-semibold text-primary_50">
                Total AUM
              </span>
              <span className="md:text-[32px] text-[28px] font-extrabold text-white">
                {formatCurrency(fundDetail?.aum || 0)}
              </span>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="md:text-[16px] text-[14px] font-semibold text-primary_50">
                Your Deposits
              </span>
              <span className="md:text-[32px] text-[28px] font-extrabold text-white">
                {formatCurrency(Number(utils.formatEther(myDeposits)))}
              </span>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="md:text-[16px] text-[14px] font-semibold text-primary_50">
                Return
              </span>
              <span
                className={`bg-success text-white text-md font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900`}
              >
                17%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-10 flex-col md:flex-row">
        <div className="w-full md:w-[60%]">
          <Strategy fundDetail={fundDetail} loading={loading} />
        </div>
        <div className="flex flex-col flex-1 gap-6"></div>
      </div>
    </div>
  );
}
