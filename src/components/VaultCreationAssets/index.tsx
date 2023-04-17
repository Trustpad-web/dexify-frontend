import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { NewVaultContext } from "../../pages/CreateVault";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import assets from "./assets";

export default function VaultCreationAssets() {
  const { setCurrentStep, setVaultMeta, vaultMeta, currentStep } =
    useContext(NewVaultContext);
  const [denominationAsset, setDenominationAsset] = useState<string>(
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
  );

  useEffect(() => {
    setDenominationAsset(vaultMeta.denominationAsset);
  }, [vaultMeta]);

  const onNextClick = () => {
    setVaultMeta({
      ...vaultMeta,
      denominationAsset,
    });
    setCurrentStep(currentStep + 1);
  };

  const onPrevClick = () => {
    setVaultMeta({
      ...vaultMeta,
      denominationAsset,
    });
    setCurrentStep(currentStep - 1);
  };

  const handleChanged = (changeEvent: any) => {
    setDenominationAsset(changeEvent.target.value);
  };

  return (
    <div className="">
      <h3 className="text-title font-bold text-[16px] md:text-[20px]">
        Assets
      </h3>
      <div className="flex mt-5 gap-5 flex-col md:flex-row">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Entry Asset
          </label>
          <div className="flex gap-5">
            {assets.map((asset) => (
              <label
                htmlFor={`denominationAsset_${asset.address}`}
                className="flex flex-1 gap-2 items-center min-w-[80px] w-full shadow-md px-5 py-3 rounded-[12px]"
              >
                <input
                  type="radio"
                  id={`denominationAsset_${asset.address}`}
                  className=""
                  value={asset.address}
                  checked={asset.address === denominationAsset}
                  onChange={handleChanged}
                />
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
            ))}
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
