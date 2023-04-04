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
    <div className="">
      <CustomNavbar onClickToggle={onClickToggle} />
      <CustomSidebar collapsed={collapsed} hide={() => setCollapsed(true)} />
      {children}
    </div>
  );
};

export default Layout;
