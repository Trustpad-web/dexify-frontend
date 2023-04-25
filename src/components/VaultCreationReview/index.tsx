import { useContext, useEffect, useState } from "react";
import { Button, Spinner, TextInput } from "flowbite-react";
import { NewVaultContext } from "../../pages/CreateVault";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { Token } from "../../@types/token";
import assets from "../VaultCreationAssets/assets";
import { useConnectWallet } from "@web3-onboard/react";
import notification from "../../helpers/notification";
import { useCreateNewFund } from "../../hooks/useCreateNewFund";
import { prepareFundData } from "../../helpers/createFund";
import { FundOverview } from "../../@types";
import { useAppDispatch } from "../../store";
import { addFund } from "../../store/slices/all_dexfunds.slice";
import SuccessModal from "./SuccessModal";
import backendAPI from "../../api";
import { signMessage } from "../../helpers/web3";
import useProvider from "../../hooks/useProvider";
import categories, { FundCategoryType } from "../CreateVaultBasics/categories";
import {
  EntranceFeeTooltipText,
  ManagementFeeTooltipText,
  PerformanceFeeTooltipText,
  TimeLockTooltipText,
} from "../../constants";
import CustomTooltip from "../Tooltip";
import { getTokenInfo } from "../../helpers";

export default function VaultCreationReview() {
  const { setCurrentStep, setVaultMeta, vaultMeta, currentStep } =
    useContext(NewVaultContext);

  const [asset, setAsset] = useState<Token>();

  const [{ wallet }] = useConnectWallet();
  const provider = useProvider();

  const { createNewFund, loading, disabled } = useCreateNewFund();
  const dispatch = useAppDispatch();

  const [newFundAddress, setNewFundAddress] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  useEffect(() => {
    setAsset(
      assets.find((asset) => asset.address === vaultMeta.denominationAsset)
    );
  }, [vaultMeta]);

  const onCreateFund = async () => {
    if (!wallet?.accounts?.[0]?.address) {
      notification.warning("Error", "Please connect wallet first");
      return;
    }
    if (disabled) {
      notification.warning(
        "Error",
        "Please switch the network to Binance Smart Chain"
      );
      return;
    }

    const { feeArgsData, policyArgsData } = prepareFundData(
      vaultMeta?.entryFee,
      vaultMeta?.performanceFee,
      vaultMeta?.managementFee,
      vaultMeta?.minDepositAmount
    );
    const { newFundAddr, newComptrollerAddr } = await createNewFund(
      wallet?.accounts?.[0]?.address,
      vaultMeta.name,
      vaultMeta.denominationAsset,
      vaultMeta.timelock,
      feeArgsData,
      policyArgsData
    );

    if (!newFundAddr) {
    } else {
      const newFund: FundOverview = {
        id: newFundAddr.toLowerCase(),
        name: vaultMeta.name,
      };
      setNewFundAddress(newFundAddr);

      // upload fund image
      if (provider) {
        const { signature, address } = await signMessage(
          provider.getSigner(wallet?.accounts?.[0]?.address)
        );
        const res = await backendAPI.fund.postFund(
          signature,
          newFundAddr.toLowerCase(),
          address,
          vaultMeta.category,
          vaultMeta.imageFile,
          vaultMeta.description
        );
        setShowSuccessModal(true);
      }

      dispatch(addFund(newFund));
    }
  };

  const onPrevClick = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="">
      <h3 className="text-title font-bold text-[16px] md:text-[20px]">
        Review
      </h3>
      <div className="w-full mt-5">
        <img
          src={vaultMeta.image}
          alt=""
          className="rounded-[12px] w-[200px] h-[120px]"
        />
        <div className="flex flex-col gap-2 flex-1 mt-5">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Type
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={
              categories.find((item) => item.value == vaultMeta.category)?.label
            }
            type="text"
            readOnly
          />
        </div>
        <div className="flex w-full flex-col mt-5 gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              Description
            </label>
            <textarea
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={vaultMeta.description}
              readOnly
              maxLength={150}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description"
              >
                Dexfund Name
              </label>
              <input
                className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
                value={vaultMeta.name}
                type="text"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description"
              >
                Symbol
              </label>
              <input
                className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
                value={vaultMeta.symbol}
                readOnly
              />
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description"
              >
                Denomination Asset
              </label>
              <label
                htmlFor={`denominationAsset_${asset?.address}`}
                className="flex flex-1 gap-2 items-center bg-white min-w-[80px] w-full shadow-sm px-5 py-3 rounded-[12px]"
              >
                <img
                  src={asset?.logoURI}
                  alt="logo"
                  className="w-[28x] h-[28px]"
                />
                <label
                  htmlFor=""
                  className="text-title text-[12px] md:text-[14px]"
                >
                  {asset?.symbol}
                </label>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
              >
                Entry Fee
                <CustomTooltip title="" content={EntranceFeeTooltipText} />
              </label>
              <TextInput
                id="entryfee"
                placeholder="0.25"
                addon="%"
                value={vaultMeta.entryFee}
                readOnly
                className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
              >
                Performance Fee
                <CustomTooltip title="" content={PerformanceFeeTooltipText} />
              </label>
              <TextInput
                id="entryfee"
                placeholder="0.25"
                addon="%"
                readOnly
                value={vaultMeta.performanceFee}
                className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description flex items-center gap-1"
              >
                Management Fee
                <CustomTooltip title="" content={ManagementFeeTooltipText} />
              </label>
              <TextInput
                id="entryfee"
                placeholder="0.25"
                addon="%"
                readOnly
                value={vaultMeta.managementFee}
                className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 w-full shadow-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor=""
                className="text-[10px] md:text-[12px] text-description"
              >
                Minimum Deposit
              </label>
              <TextInput
                id="asset-logo"
                placeholder="1"
                addon={
                  <img
                    className="w-[24px] h-auto"
                    src={getTokenInfo(vaultMeta.denominationAsset)?.logoURI}
                  />
                }
                value={vaultMeta.minDepositAmount}
                readOnly
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
              <CustomTooltip title="" content={TimeLockTooltipText} />
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={vaultMeta.timelock}
              readOnly
            />
          </div>
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
        {loading ? (
          <Button
            color={"white"}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
          >
            <Spinner color={"purple"} aria-label="Default status example" />
          </Button>
        ) : (
          <Button
            color={"white"}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
            onClick={onCreateFund}
            disabled={disabled}
          >
            Launch Fund {` `} <HiOutlineChevronRight color="white" />
          </Button>
        )}
      </div>
      <SuccessModal
        fundAddress={newFundAddress}
        onClose={() => setShowSuccessModal(false)}
        show={showSuccessModal}
      />
    </div>
  );
}
