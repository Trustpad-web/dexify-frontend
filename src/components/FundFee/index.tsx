import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { feeQuery } from "../../graphql/queries/fee";
import TableRowSkeleton from "../Skeleton/TableRowSkeleton";
import { AssetDto } from "../../@types";
import { formatNumber, getTokenInfo } from "../../helpers";
import { BigNumber, utils } from "ethers";
import {
  decodeFeeConfigData,
  decodePolicyConfigData,
} from "../../helpers/web3";
import { secondsToHms } from "../../helpers/time";

export default function FundFee({ id }: { id: string }) {
  const { loading, data } = useQuery(feeQuery(id));

  const [entryFee, setEntryFee] = useState<BigNumber>(BigNumber.from(0));
  const [performanceFee, setPerformanceFee] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [managementFee, setManagementFee] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [minInvestAmount, setMinInvestAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [maxInvestAmount, setMaxInvestAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [denominationAsset, setDenominationAsset] = useState<AssetDto>();
  const [timelock, setTimelock] = useState<number>(0);

  useEffect(() => {
    if (data && data.fund) {
      const fund = data.fund;
      const comptrollerProxy = fund.comptrollerProxies?.[0];
      if (comptrollerProxy) {
        try {
          const { feeManagerConfigData, policyManagerConfigData } =
          comptrollerProxy;
        setDenominationAsset(comptrollerProxy.denominationAsset);
        setTimelock(comptrollerProxy.sharesActionTimelock);

        
        // Decode policy config data
        const { min, max } = decodePolicyConfigData(policyManagerConfigData);
        setMinInvestAmount(min);
        setMaxInvestAmount(max);
        // Decode fee config data
        const { entryFee, performanceFee, managementFee } =
          decodeFeeConfigData(feeManagerConfigData);

        setEntryFee(entryFee);
        setPerformanceFee(performanceFee);
        setManagementFee(managementFee);
        } catch (err) {
          console.log("fund fee parse error: ", err);
        }
      }
    }
  }, [data]);

  return (
    <div className="w-full">
      {loading ? (
        <TableRowSkeleton />
      ) : (
        <div className="w-full">
          <h4 className="mb-5 text-title text-[18px] md:text-[24px] font-bold">
            Fees
          </h4>
          <div className="rounded-[12px] bg-white w-full">
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Performance Fee
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {formatNumber(
                  Number(
                    utils.formatUnits(
                      performanceFee.mul(100),
                      Number(denominationAsset?.decimals || 18)
                    )
                  )
                )}
                %
              </span>
            </div>
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Entry Fee
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {formatNumber(
                  Number(
                    utils.formatUnits(
                      entryFee.mul(100),
                      Number(denominationAsset?.decimals || 18)
                    )
                  )
                )}
                %
              </span>
            </div>
            {/* <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Management Fee
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {formatNumber(
                  Number(
                    utils.formatUnits(
                      managementFee.mul(100),
                      Number(denominationAsset?.decimals || 18)
                    )
                  )
                )}
                %
              </span>
            </div> */}
          </div>
          <h4 className="my-5 text-title text-[18px] md:text-[24px] font-bold">
            Policies
          </h4>
          <div className="rounded-[12px] bg-white w-full">
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Min Investment
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {formatNumber(
                  Number(
                    utils.formatUnits(
                      minInvestAmount,
                      Number(denominationAsset?.decimals || 18)
                    )
                  )
                )}
              </span>
            </div>
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Max Investment
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {formatNumber(
                  Number(
                    utils.formatUnits(
                      maxInvestAmount,
                      Number(denominationAsset?.decimals || 18)
                    )
                  )
                )}
              </span>
            </div>
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Denomination Asset
              </span>
              <div className="text-primary text-[16px] md:text-[20px] font-bold flex items-center">
                <img
                  src={getTokenInfo(denominationAsset?.id || "0x")?.logoURI}
                  alt=""
                  className="rounded-[50%] w-[32px] mr-3"
                />
                <span className="">{denominationAsset?.symbol}</span>
              </div>
            </div>
            <div className="flex w-full  p-3 justify-between items-center">
              <span className="text-description text-[14px] md:text-[16px] font-medium">
                Timelock
              </span>
              <span className="text-primary text-[16px] md:text-[20px] font-bold">
                {secondsToHms(timelock) || "No"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
