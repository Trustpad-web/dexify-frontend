import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function usePageTitle() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    let title = "";
    switch (location.pathname) {
      case "/":
        title = "Home";
        break;
      case "/home":
        title = "Home";
        break;
      case "/portfolio":
        title = "Portfolio";
        break;
      case "/manage":
        title = "Managements";
        break;
      case "/create-vault":
        title = "Create New Fund";
        break;
      case "/all-funds":
        title = "All Funds";
        break;
      case "/index-funds":
        title = "Index Funds";
        break;
      case "/institution-funds":
        title = "Institution Funds";
        break;
      case "/icon-funds":
        title = "Icon Funds";
        break;
      case "/account":
        title = "Profile";
        break;
    }

    setPageTitle(title);
  }, [location.pathname]);

  return pageTitle
}
