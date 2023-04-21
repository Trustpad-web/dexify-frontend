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
    <div className="flex justify-center w-full bg-[#f2e9f5bf] md:py-2">
      <div className="flex w-full max-w-[1536px] md:gap-[20px] rounded-md h-fit">
        <CustomSidebar collapsed={collapsed} hide={() => setCollapsed(true)} />
        <div className="app-layout border-2 flex flex-col flex-1 border-none dark:bg-gray-800 overflow-y-auto  overflow-x-hidden h-screen">
          <CustomNavbar onClickToggle={onClickToggle} />
          <div className="page-layout mt-2 md:mt-5 w-full flex-1 pb-5 md:px-0 px-[10px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
