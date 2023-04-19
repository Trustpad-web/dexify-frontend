import { Sidebar } from "flowbite-react/lib/esm/components";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useEffect, useState } from "react";
import menu from "./menu";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { useConnectWallet } from "@web3-onboard/react";

export default function CustomSidebar({
  collapsed,
  hide,
}: {
  collapsed: boolean;
  hide: () => void;
}) {
  const matches = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  // const dispatch = useAppDispatch();
  // const themeMode = useAppSelector((state) => state.theme.value);

  const [collapseBehavior, setCollapseBehavior] = useState<"hide" | "collapse">(
    "hide"
  );
  const [{wallet}] = useConnectWallet();

  useEffect(() => {
    setCollapseBehavior(matches ? "hide" : "collapse");
  }, [matches]);

  return (
    <div className="w-fit z-20">
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className={`${matches ? 'fixed top-0 left-0' : ''} z-10 w-[320px] h-screen rounded-none p-3 pt-5 bg-white dark:bg-gray-800 delay-75`}
        id="logo-sidebar"
        collapsed={collapsed}
        collapseBehavior={collapseBehavior}
      >
        <Sidebar.Logo
          href="#"
          img="/imgs/brand_logo.png"
          imgAlt="Flowbite logo"
        />
        <Sidebar.Items className="mt-[50px]">
          <Sidebar.ItemGroup className="space-y-8">
            {menu.map((menuItem) => (
              <Sidebar.Item
                icon={menuItem.icon}
                key={menuItem.title}
                active={location.pathname === menuItem.href}
                as={Link}
                onClick={() => matches ? hide() : {}}
                to={menuItem.href}
                className={(location.pathname === menuItem.href ? 'active filter-svg' : '') + ' py-3 text-[14px] md:text-[18px] hover:bg-hoverColor' + (menuItem.isProtected && !wallet?.accounts?.[0]?.address ? ` hidden` : ' block')}
              >
                {menuItem.title}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item> </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        {/* <div
          className="mx-3 items-center mb-0 flex md:hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(toggleTheme());
          }}
        >
          <DarkModeSwitch
            checked={themeMode === "dark"}
            onChange={() => dispatch(toggleTheme())}
            size={22}
          />
          <div className="dark:text-white ml-2">Theme</div>
        </div> */}
      </Sidebar>
      {matches && !collapsed && (
        <div
          drawer-backdrop="logo-sidebar"
          className={`bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-8`}
          onClick={() => {
            hide();
          }}
        />
      )}
    </div>
  );
}
