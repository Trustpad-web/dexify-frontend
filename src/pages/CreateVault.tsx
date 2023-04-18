import { createContext, useState } from "react";
import VaultCreationSteps from "../components/VaultCreationSteps";
import CreateVaultBasics from "../components/CreateVaultBasics";
import VaultCreationFinancials from "../components/VaultCreationFinancials";
import VaultCreationAssets from "../components/VaultCreationAssets";
import VaultCreationReview from "../components/VaultCreationReview";
import { FundCategoryType } from "../components/CreateVaultBasics/categories";

export type VaultMetaData = {
  category: FundCategoryType,
  name: string;
  symbol: string;
  image: string;
  imageFile: File | undefined;
  entryFee: number;
  performanceFee: number;
  minDepositAmount: number;
  maxDepositAmount: number;
  timelock: number;
  denominationAsset: string;
};

const initialVaultMetaData = {
  category: FundCategoryType.ICON,
  name: "",
  symbol: "DXFY",
  image: "",
  imageFile: undefined,
  entryFee: 0,
  performanceFee: 0,
  minDepositAmount: 0,
  maxDepositAmount: 0,
  timelock: 0,
  denominationAsset: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
};

export type VaultContextData = {
  currentStep: number;
  vaultMeta: VaultMetaData;
  setCurrentStep: (value: number) => void;
  setVaultMeta: (data: VaultMetaData) => void;
};
export const NewVaultContext = createContext<VaultContextData>({
  currentStep: 0,
  vaultMeta: initialVaultMetaData,
  setCurrentStep: (value: number) => {},
  setVaultMeta: (data: VaultMetaData) => {},
});

export default function CreateVault() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [vaultMeta, setVaultMeta] =
    useState<VaultMetaData>(initialVaultMetaData);
  console.log("vaultMeta: ", vaultMeta, currentStep);
  return (
    <NewVaultContext.Provider
      value={{
        vaultMeta: vaultMeta,
        currentStep: currentStep,
        setCurrentStep,
        setVaultMeta,
      }}
    >
      <div className="flex w-full items-center flex-col">
        <div className="flex flex-col w-full rounded-[12px] bg-secondary text-white gap-5 pt-8 pb-20 items-center px-5 items-center">
          <label htmlFor="" className="text-[16px] md:text-[20px] text-center">
            Create a Fund! 4 Quick Steps.
          </label>
          <p className="text-[14px] md:text-[16px] text-center">
            Ready to share your alpha to anyone with an internet connection?
          </p>
        </div>
        <div className="md:w-[80%] max-w-[800px] w-full -mt-[50px]">
          <VaultCreationSteps />
          <div className="mt-8">
            {currentStep === 0 && <CreateVaultBasics />}
            {currentStep === 1 && <VaultCreationAssets />}
            {currentStep === 2 && <VaultCreationFinancials />}
            {currentStep === 3 && <VaultCreationReview />}
          </div>
        </div>
      </div>
    </NewVaultContext.Provider>
  );
}
