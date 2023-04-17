import { useContext, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { NewVaultContext } from "../../pages/CreateVault";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export default function VaultCreationFinancials() {
  const { setCurrentStep, setVaultMeta, vaultMeta, currentStep } =
    useContext(NewVaultContext);

  const [entryFee, setEntryFee] = useState<number>(0);
  const [performanceFee, setPerformanceFee] = useState<number>(0);
  const [minDepositAmount, setMinDepositAmount] = useState<number>(0);
  const [maxDepositAmount, setMaxDepositAmount] = useState<number>(0);
  const [timelock, setTimelock] = useState<number>(0);

  useEffect(() => {
    setEntryFee(vaultMeta.entryFee);
    setPerformanceFee(vaultMeta.performanceFee);
    setMinDepositAmount(vaultMeta.minDepositAmount);
    setMaxDepositAmount(vaultMeta.maxDepositAmount);
    setTimelock(vaultMeta.timelock);
  }, [vaultMeta]);

  const onNextClick = () => {
    setVaultMeta({
      ...vaultMeta,
      entryFee,
      performanceFee,
      minDepositAmount,
      maxDepositAmount,
      timelock,
    });
    setCurrentStep(currentStep + 1);
  };

  const onPrevClick = () => {
    setVaultMeta({
      ...vaultMeta,
      entryFee,
      performanceFee,
      minDepositAmount,
      maxDepositAmount,
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
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Entry Fee
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={entryFee}
            type="number"
            placeholder="0.025%"
            onChange={(e) => setEntryFee(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Performance Fee
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={performanceFee}
            type="number"
            placeholder="0.25%"
            onChange={(e) => setPerformanceFee(Number(e.target.value))}
          />
        </div>
        <div className="flex w-full flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              Mininum Deposit
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={minDepositAmount}
              type="number"
              placeholder="1"
              onChange={(e) => setMinDepositAmount(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              Maximum Deposit
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={maxDepositAmount}
              type="number"
              placeholder="100,000"
              onChange={(e) => setMaxDepositAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Time lock (s)
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
