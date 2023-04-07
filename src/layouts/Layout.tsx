import { ReactNode, useState, useEffect } from "react";
import CustomNavbar from "../components/Navbar";
import CustomSidebar from "../components/Sidebar";
import useMediaQuery from "../hooks/useMediaQuery";

const Layout = ({ children }: { children: ReactNode }) => {
  const matches = useMediaQuery("(max-width: 768px)");
  const [collapsed, setCollapsed] = useState<boolean>(true);
  useEffect(() => {
    setCollapsed(matches);
  }, [matches]);

  const onClickToggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="flex">
      <CustomSidebar collapsed={collapsed} hide={() => setCollapsed(true)} />
      <div className="app-layout border-2 flex flex-col flex-1 border-none bg-white dark:bg-gray-800 overflow-y-auto h-screen">
        <CustomNavbar onClickToggle={onClickToggle} />
        <div className="page-layout mt-0 md:mt-5 w-full flex-1 pb-5 px-[10px] md:px-[20px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
