import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/slices/theme.slice";
import { useConnectWallet } from "@web3-onboard/react";
import ConnectButton from "../ConnectButton";
import { shortenAddress } from "../../helpers";

export default function CustomNavbar({
  onClickToggle,
}: {
  onClickToggle: () => void;
}) {

  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  // Wallet connection
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const handleSignout = () => {
    if (wallet) {
      disconnect(wallet);
    }
  }

  const handleCollapse = () => {
    onClickToggle();
  };

  return (
    <Navbar
      fluid={true}
      rounded={false}
      className="sticky w-full px-5 py-5 md:pr-[50px] top-0 z-10"
    >
      <Navbar.Toggle onClick={handleCollapse} />
      <Navbar.Brand href="https://dexify.io/" className="flex md:hidden">
        <img
          src="/imgs/logo.png"
          className="mx-3 h-[36px]"
          alt="Flowbite Logo"
        />
      </Navbar.Brand>

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
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded={true}
              >
                <div className="space-y-1 font-medium text-primary dark:text-white text-start">
                  <div className="text-sm text-description dark:text-gray-400">
                    New User
                  </div>
                  <div>{shortenAddress(wallet.accounts[0].address)}</div>
                </div>
              </Avatar>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
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
