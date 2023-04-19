import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as TwitterIcon } from "../assets/imgs/twitter-icon.svg";
import { useAppDispatch, useAppSelector } from "../store";
import { useConnectWallet } from "@web3-onboard/react";
import notification from "../helpers/notification";
import {
  createOrUpdateMyAccount,
  logoutTwitterUser,
} from "../store/slices/accountSlice";
import useProvider from "../hooks/useProvider";
import { twitterLogin } from "../api/twitter";
import { HiX } from "react-icons/hi";
import ImageCropModal from "../components/ImageCropModal/ImageCropModal";
import { Spinner } from "flowbite-react";

const Profile = () => {
  const myAccountState = useAppSelector((state) => state.account);
  const [{ wallet }] = useConnectWallet();
  const [account, setAccount] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const provider = useProvider();
  const imageFileRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [cropmodalOpen, setCropmodalOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [twitterName, setTwitterName] = useState<string>("");
  const [twitterScreenName, setTwitterScreenName] = useState<string>("");
  const [twitterImage, setTwitterImage] = useState<string>("");

  useEffect(() => {
    if (wallet) {
      setAccount(wallet?.accounts?.[0]?.address);
    }
  }, [wallet]);

  useEffect(() => {
    const {user} = myAccountState;
    
    setImageUrl(user.image);
    setName(user.name);
    setTitle(user.title);
    setEmail(user.email);
    setBio(user.bio);
    setTwitterImage(user.twitterImage);
    setTwitterName(user.twitterName);
    setTwitterScreenName(user.twitterScreenName);
    
  }, [myAccountState.user]);

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
      setImageUrl(URL.createObjectURL(files[0]));
      setCropmodalOpen(true);
    }
  };

  const handleUpdate = () => {
    if (title === "") {
      notification.warning("Input your username.", "");
      return;
    }
    if (name === "") {
      notification.warning("Input your name.", "");
      return;
    }

    const data = {
      id: myAccountState.user.id,
      address: wallet?.accounts?.[0]?.address || "",
      name,
      title,
      email,
      bio,
      image: imageUrl,
      twitterName,
      twitterScreenName,
      twitterImage,
    };

    if (provider) {
      dispatch(
        createOrUpdateMyAccount({
          signer: provider?.getSigner(account),
          file: imageFile,
          newAccount: data,
        })
      );
    }
  };

  const onTwitterLogin = () => {
    localStorage.setItem("twitter_login_location", "account");
    twitterLogin();
  };

  const onTwitterLogout = () => {
    if (provider) {
      dispatch(logoutTwitterUser(provider.getSigner(account)));
    }
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-[800px] mx-auto gap-4">
        <h1 className="text-title text-[16px] md:text-[20px] font-bold">
          My Account
        </h1>
        <div
          className="account-avatar relative w-[200px] h-[200px] md:h-[300px] md:w-[300px] bg-white border-2 border-dashed border-[#727171] rounded-[12px]"
          onDragEnter={handleDrag}
        >
          {imageUrl !== "" && (
            <button
              className="w-6 h-6 flex items-center justify-center rounded-full absolute right-[-10px] top-[-10px] z-[5] bg-bg-1 dark:bg-bg-1-dark shadow-lg"
              onClick={() => {
                setImageUrl("");
                setImageFile(undefined);
              }}
            >
              <HiX width={16} className="hover:text-primary" />
            </button>
          )}
          <div
            className="w-full h-full account-avatar overflow-hidden flex justify-center items-center"
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
        <div className="flex flex-col gap-4 my-8">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            className=" hidden"
            onChange={handleChange}
            ref={imageFileRef}
          />

          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              User Title
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={title}
              name="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              User Name
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              Email
            </label>
            <input
              className="text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label
              htmlFor=""
              className="text-[10px] md:text-[12px] text-description"
            >
              Bio
            </label>
            <textarea
              className="resize-none text-title font-bold md:text-[16px] text-[14px] focus:border-[#333002] outline-none rounded-[12px] bg-white border-2 py-3 px-5 w-full"
              value={bio}
              name="bio"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {twitterScreenName ? (
            <div className=" flex items-center gap-4 relative">
              <img
                src={twitterImage}
                alt="twitter-user"
                className="w-10 h-10 rounded-full"
              />
              <TwitterIcon
                width={16}
                height={16}
                className="bg-bg-2 dark:bg-bg-2-dark rounded-full absolute left-7 top-0 border-2 border-bg-2 dark:border-bg-2-dark"
              />
              <div className="font-bold text-lg text-[#03a9f4]">
                @{twitterName}
              </div>
              <button
                onClick={onTwitterLogout}
                className="ml-auto px-4 py-2 bg-red-500/50 dark:bg-red-900/50 rounded-lg font-bold text-slate-900 dark:text-slate-200 hover:bg-red-400 dark:hover:bg-red-900"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className=" flex items-center gap-4">
              <TwitterIcon fill="gray" width={28} height={28} />
              <div className=" text-gray-600 font-bold text-lg">Twitter</div>
              <button
                onClick={onTwitterLogin}
                className="ml-auto px-4 py-2 bg-blue-500/50 dark:bg-blue-900/50 rounded-lg font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-400 dark:hover:bg-blue-900"
              >
                Connect
              </button>
            </div>
          )}
        </div>
        {myAccountState.loading ? (
          <button className="p-3 w-full bg-primary rounded-lg text-white hover:opacity-90">
            <Spinner />
          </button>
        ) : (
          <button
            className="p-3 w-full bg-primary rounded-lg text-white hover:opacity-90"
            onClick={handleUpdate}
          >
            {myAccountState.user.id ? "Update Account" : "Create Account"}
          </button>
        )}
      </div>
      <ImageCropModal
        isOpen={cropmodalOpen}
        image={imageUrl}
        onClose={() => setCropmodalOpen(false)}
        onCrop={handleCroppedImage}
        aspect={1}
      />
    </>
  );
};

export default Profile;
