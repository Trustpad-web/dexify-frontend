import { useState, useEffect, useContext, useRef } from "react";
import { NewVaultContext } from "../../pages/CreateVault";
import { HiOutlineChevronRight, HiX } from "react-icons/hi";
import ImageCropModal from "../ImageCropModal/ImageCropModal";
import { Button } from "flowbite-react";
import notification from "../../helpers/notification";
import Select from "../Select";
import categories, { FundCategoryType } from "./categories";
export default function CreateVaultBasics() {
  const { setCurrentStep, setVaultMeta, vaultMeta, currentStep } =
    useContext(NewVaultContext);
  const [fundName, setFundName] = useState<string>("");

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [cropmodalOpen, setCropmodalOpen] = useState<boolean>(false);
  const [originImageUrl, setOriginImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageFileRef = useRef<HTMLInputElement | null>(null);
  const [fundType, setFundType] = useState<FundCategoryType>(
    FundCategoryType.ICON
  );
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setFundName(vaultMeta.name);
    setImageUrl(vaultMeta.image);
    setFundType(vaultMeta.category);
    setDescription(vaultMeta.description);
  }, [vaultMeta]);

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

  const onNextClick = () => {
    if (!imageUrl || !fundName) {
      notification.warning(
        "Validation Error",
        "All fields should not be empty"
      );
      return;
    }
    setVaultMeta({
      ...vaultMeta,
      image: imageUrl,
      imageFile,
      name: fundName,
      category: fundType,
      description: description
    });
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="">
      <h3 className="text-title font-bold text-[16px] md:text-[20px]">
        Basic Details
      </h3>
      <div className="flex flex-col gap-2 flex-1 mt-5">
        <label
          htmlFor=""
          className="text-[10px] md:text-[12px] text-description"
        >
          Fund Category
        </label>
        <Select
          items={categories}
          onChange={(value: FundCategoryType) => setFundType(value)}
          value={Number(fundType)}
        />
      </div>
      <div className="flex mt-5 gap-5 flex-col md:flex-row">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Dexfund Name
          </label>
          <input
            className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 md:max-w-[300px]">
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
      <div className="flex flex-col gap-2 w-full mt-5">
        <label
          htmlFor=""
          className="text-[10px] md:text-[12px] text-description"
        >
          Description
        </label>
        <input
          className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
          value={vaultMeta.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex mt-5 gap-5">
        <div className="flex flex-col gap-2 flex-1">
          <label
            htmlFor=""
            className="text-[10px] md:text-[12px] text-description"
          >
            Fund Image
          </label>
          <div className="account-avatar relative bg-white rounded-md" onDragEnter={handleDrag}>
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
              className="w-full h-[350px] account-avatar overflow-hidden rounded-[12px] border-dashed border-2 justify-center items-center flex"
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
      <Button
        color={"white"}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
        onClick={onNextClick}
      >
        Next {` `} <HiOutlineChevronRight color="white" />
      </Button>
      <ImageCropModal
        isOpen={cropmodalOpen}
        image={originImageUrl}
        onClose={() => setCropmodalOpen(false)}
        onCrop={handleCroppedImage}
      />
    </div>
  );
}
