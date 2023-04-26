import { useContext, useEffect, useState } from "react";
import { Button, TextInput } from "flowbite-react";
import Tooltip from '../Tooltip';
import { NewVaultContext } from "../../pages/CreateVault";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineInformationCircle } from "react-icons/hi";
import notification from "../../helpers/notification";
import { EntranceFeeTooltipText, ManagementFeeTooltipText, MinInvestmentTooltipText, PerformanceFeeTooltipText, TimeLockTooltipText } from "../../constants";
import { getTokenInfo } from "../../helpers";

export default function VaultCreationFinancials() {
  const { setCurrentStep, setVaultMeta, vaultMeta, currentStep } =
    useContext(NewVaultContext);

  const [entryFee, setEntryFee] = useState<number>(0);
  const [performanceFee, setPerformanceFee] = useState<number>(0);
  const [managementFee, setManagementFee] = useState<number>(0);
  const [minDepositAmount, setMinDepositAmount] = useState<number>(0);
  const [timelock, setTimelock] = useState<number>(0);

  useEffect(() => {
    setEntryFee(vaultMeta.entryFee);
    setPerformanceFee(vaultMeta.performanceFee);
    setMinDepositAmount(vaultMeta.minDepositAmount);
    setManagementFee(vaultMeta.managementFee);
    setTimelock(vaultMeta.timelock);
  }, [vaultMeta]);

  const onNextClick = () => {
    if (!minDepositAmount) {
      notification.warning("Validation Error", "MIN deposit value is not correct");
      return;
    }
    
    setVaultMeta({
      ...vaultMeta,
      entryFee,
      performanceFee,
      managementFee,
      minDepositAmount,
      timelock,
    });
    setCurrentStep(currentStep + 1);
  };

  const onPrevClick = () => {
    if (!minDepositAmount) {
      notification.warning("Validation Error", "MIN deposit value is not correct");
      return;
    }

    setVaultMeta({
      ...vaultMeta,
      entryFee,
      performanceFee,
      managementFee,
      minDepositAmount,
      timelock,
    });
    setCurrentStep(currentStep - 1);
  };
  return (
    <div className="">
      <h3 className="text-title font-bold text-[16px] md:text-[20px]">
        Financials
      </h3>
      <div className="flex mt-5 gap-5 flex-col">
        <div className="flex w-full flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
            >
              Entry Fee
              <Tooltip title="" content={EntranceFeeTooltipText} />
            </label>
            <TextInput
              id="entryfee"
              placeholder="0.25"
              addon="%"
              type="number"
              value={entryFee}
              onChange={e => setEntryFee(Number(e.target.value))}
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
            />
            
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
            >
              Performance Fee
              <Tooltip title="" content={PerformanceFeeTooltipText} />
            </label>
            <TextInput
              id="performanceFee"
              placeholder="0.25"
              addon="%"
              type="number"
              value={performanceFee}
              onChange={e => setPerformanceFee(Number(e.target.value))}
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
            >
              Management Fee
              <Tooltip title="" content={ManagementFeeTooltipText} />
            </label>
            <TextInput
              id="managementFee"
              placeholder="0.25"
              type="number"
              addon="%"
              value={managementFee}
              onChange={e => setManagementFee(Number(e.target.value))}
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
            />
          </div>
        </div>
        <div className="flex w-full flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
            >
              Mininum Deposit
              <Tooltip title="" content={MinInvestmentTooltipText} />
            </label>
            <TextInput
              id="asset-logo"
              placeholder="1"
              addon={<img className="w-[24px] h-auto" src={getTokenInfo(vaultMeta.denominationAsset)?.logoURI} />}
              value={minDepositAmount}
              onChange={e => setMinDepositAmount(Number(e.target.value))}
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
            />
          </div>
          
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
          >
            Time lock (s)
            <Tooltip title="" content={TimeLockTooltipText} />
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={timelock}
            type="number"
            placeholder="3600"
            onChange={(e) => setTimelock(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex gap-5 justify-center items-center">
        <Button
          color={"white"}
          className="border-1 border-description text-description shadow-md mx-auto mt-10 rounded-[32px]"
          onClick={onPrevClick}
        >
          <HiOutlineChevronLeft color="#333" />
          Back {` `}
        </Button>
        <Button
          color={"white"}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
          onClick={onNextClick}
        >
          Next {` `} <HiOutlineChevronRight color="white" />
        </Button>
      </div>
    </div>
  );
}
