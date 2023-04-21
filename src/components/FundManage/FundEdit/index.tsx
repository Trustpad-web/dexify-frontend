import { useEffect, useState, useRef } from "react";
import { Button, Spinner } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../../@types";
import { HiOutlineChevronRight, HiX } from "react-icons/hi";
import ImageCropModal from "../../ImageCropModal/ImageCropModal";
import useProvider from "../../../hooks/useProvider";
import { signMessage } from "../../../helpers/web3";
import { useConnectWallet } from "@web3-onboard/react";
import backendAPI from "../../../api";
import categories, {
  FundCategoryType,
} from "../../CreateVaultBasics/categories";
import notification from "../../../helpers/notification";
import Select from "../../Select";

export default function FundEdit({
  fundDetail,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
}) {
  const [fundName, setFundName] = useState<string>(fundDetail?.name || "");
  const [fundDescription, setFundDescription] = useState<string>(
    fundDetail?.description || ""
  );
  const [performanceFee, setPerformanceFee] = useState<number>(0);
  const [fundCategory, setFundCategory] = useState<FundCategoryType>(
    FundCategoryType.ICON
  );
  const [endtryFee, setEntryFee] = useState<number>(0);
  const [minInvestment, setMinInvestment] = useState<number>(0);
  const [maxInvestment, setMaxInvestment] = useState<number>(0);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [cropmodalOpen, setCropmodalOpen] = useState<boolean>(false);
  const [originImageUrl, setOriginImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageFileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const provider = useProvider();
  const [{ wallet }] = useConnectWallet();

  const onEditFund = async () => {
    if (provider) {
      setLoading(true);
      try {
        const { signature, address } = await signMessage(
          provider.getSigner(wallet?.accounts?.[0]?.address)
        );
        const res = await backendAPI.fund.postFund(
          signature,
          fundDetail?.id.toLowerCase() || "",
          address,
          fundCategory,
          imageFile,
          fundDescription
        );
        notification.success("Success", "");
      } catch (error: any) {
        const err = error?.reason?.split(":");
        const errorTitle = err ? err[0].toUpperCase() : error.message;
        notification.danger(
          errorTitle,
          error?.reason?.slice(errorTitle.length + 1)
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setFundName(fundDetail?.name || "");
    setImageUrl(fundDetail?.image || "");
    setFundCategory(
      fundDetail?.category !== undefined
        ? fundDetail.category
        : FundCategoryType.ICON
    );
    setFundDescription(fundDetail?.description || "");
  }, [fundDetail]);

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const handleCroppedImage = async (croppedImage: string) => {
    const response = await fetch(croppedImage);
    const data = await response.blob();
    const metadata = {
      type: "image/png",
    };
    const file = new File([data], "avatar.png", metadata);
    setImageUrl(croppedImage);
    setImageFile(file);
    setCropmodalOpen(false);
  };

  const handleFile = (files: FileList) => {
    if (files && files[0]) {
      setImageFile(files[0]);
      setOriginImageUrl(URL.createObjectURL(files[0]));
      setCropmodalOpen(true);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex w-full gap-5">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Image
          </label>
          <div
            className="account-avatar relative w-full md:w-[250px] md:h-[150px] h-[200px] bg-white"
            onDragEnter={handleDrag}
          >
            {imageUrl !== "" && (
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full absolute right-[-10px] top-[-10px] z-[5] bg-bg-1 dark:bg-bg-1-dark shadow-lg"
                onClick={() => {
                  setOriginImageUrl("");
                  setImageUrl("");
                  setImageFile(undefined);
                }}
              >
                <HiX width={16} className="hover:text-primary" />
              </button>
            )}
            <div
              className="w-full h-full account-avatar overflow-hidden rounded-[12px] border-dashed border-2 justify-center items-center flex text-center"
              onClick={() => {
                imageFileRef.current?.click();
              }}
            >
              {imageUrl !== "" ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  className="w-full h-full z-[5] left-0 top-0"
                />
              ) : (
                "Click or Drag and Drop your image."
              )}
            </div>
            {dragActive && (
              <div
                className="account-avatar absolute z-[5] bg-gray-300 dark:bg-slate-800"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                Drop your file to upload
              </div>
            )}
          </div>
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            className=" hidden"
            onChange={handleChange}
            ref={imageFileRef}
          />
        </div>
      </div>
      <div className="flex mt-5 items-start md:items-center md:flex-row flex-col gap-5">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Category
          </label>
          <Select
            items={categories}
            onChange={(value: FundCategoryType) => setFundCategory(value)}
            value={Number(fundCategory)}
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Description
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={fundDescription}
            type="text"
            onChange={(e) => setFundDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10 gap-3">
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
            onClick={onEditFund}
            disabled={loading}
          >
            Update Fund {` `} <HiOutlineChevronRight color="white" />
          </Button>
        )}
      </div>
      <ImageCropModal
        isOpen={cropmodalOpen}
        image={originImageUrl}
        onClose={() => setCropmodalOpen(false)}
        onCrop={handleCroppedImage}
      />
    </div>
  );
}
