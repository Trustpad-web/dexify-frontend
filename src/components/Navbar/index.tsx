import { useEffect } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { useConnectWallet } from "@web3-onboard/react";
import ConnectButton from "../ConnectButton";
import { formatNumber, shortenAddress } from "../../helpers";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMyAccount,
  setMyAccountAsDefault,
} from "../../store/slices/accountSlice";
import usePageTitle from "../../hooks/usePageTitle";

export default function CustomNavbar({
  onClickToggle,
}: {
  onClickToggle: () => void;
}) {
  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const myAccount = useAppSelector((state) => state.account.user);
  const pageTitle = usePageTitle();

  // Wallet connection
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const handleSignout = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  const handleCollapse = () => {
    onClickToggle();
  };

  const location = useLocation();

  useEffect(() => {
    if (wallet) {
      initAccount(wallet.accounts?.[0]?.address);
    } else {
      dispatch(setMyAccountAsDefault());
    }
  }, [wallet]);

  const initAccount = async (account: string) => {
    try {
      dispatch(getMyAccount(account));
    } catch (error) {
      throw error;
    }
  };

  return (
    <Navbar
      fluid={true}
      rounded={false}
      className="sticky w-full px-5 py-5 md:pr-[50px] top-0 z-10 shadow-md shadow-shadow_color rounded-md"
    >
      <Navbar.Toggle onClick={handleCollapse} />
      <Navbar.Brand href="https://dexify.io/" className="flex md:hidden">
        <img
          src="/imgs/logo.png"
          className="mx-3 h-[36px]"
          alt="Flowbite Logo"
        />
      </Navbar.Brand>

      <h3 className="text-title font-bold text-[16px] md:text-[20px]">
        {pageTitle}
      </h3>

      <div className="flex md:order-2 ml-auto mr-3">
        {/* <div className="mr-5 items-center mb-0 flex hidden md:flex">
          <DarkModeSwitch
            checked={themeMode.value === "dark"}
            onChange={() => dispatch(toggleTheme())}
            size={22}
          />
        </div> */}
        {wallet ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            className="w-fit min-w-[150px]"
            label={
              <Avatar alt="User settings" img={myAccount.image} rounded={true}>
                <div className="hidden md:flex flex-col">
                  <div className="space-y-1 font-medium text-primary dark:text-white text-start">
                    {myAccount.title ||
                      (myAccount.name && (
                        <div className="text-sm text-description dark:text-gray-400">
                          {myAccount.title || myAccount.name}
                        </div>
                      ))}
                  </div>
                  <div>{shortenAddress(wallet.accounts[0].address)}</div>
                </div>
              </Avatar>
            }
          >
            <Dropdown.Header>
              {wallet && (
                <span className="text-secondary font-bold">
                  Balance:{" "}
                  {formatNumber(
                    Number(wallet?.accounts?.[0]?.balance?.BNB) || 0
                  )}{" "}
                  BNB
                </span>
              )}
              {myAccount.name && <span className="text-sm"></span>}
              {myAccount.email && (
                <span className="block truncate text-sm font-medium">
                  {myAccount.email}
                </span>
              )}
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigate("/account")}>
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <ConnectButton />
        )}
      </div>
    </Navbar>
  );
}
