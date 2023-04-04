import { Sidebar } from "flowbite-react/lib/esm/components";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useEffect, useState } from "react";
import menu from "./menu";
import { Link, useLocation } from "react-router-dom";


export default function CustomSidebar({
  collapsed,
  hide,
}: {
  collapsed: boolean;
  hide: () => void;
}) {
  const matches = useMediaQuery("(max-width: 768px)");
  const location = useLocation();

  const [collapseBehavior, setCollapseBehavior] = useState<"hide" | "collapse">(
    "hide"
  );

  useEffect(() => {
    setCollapseBehavior(matches ? "hide" : "collapse");
  }, [matches]);

  return (
    <div className="w-fit">
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className="fixed top-0 left-0 z-50 w-[245px] h-screen rounded-none"
        id="logo-sidebar"
        collapsed={collapsed}
        collapseBehavior={collapseBehavior}
      >
        <Sidebar.Logo
          href="#"
          img="/imgs/brand_logo.png"
          imgAlt="Flowbite logo"
        />
        <Sidebar.Items>
          <Sidebar.ItemGroup className="space-y-5">
            {menu.map((menuItem) => (
              <Sidebar.Item
                icon={menuItem.icon}
                key={menuItem.title}
                active={location.pathname === menuItem.href}
                as={Link}
                to={menuItem.href}
              >
                {menuItem.title}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item>
              {" "}
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      {matches && !collapsed && (
        <div
          drawer-backdrop="logo-sidebar"
          className={`bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30`}
          onClick={() => {
            console.log("backdrop clicked");
            hide();
          }}
        />
      )}
    </div>
  );
}
