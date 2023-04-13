import {
  HiHome,
  HiCurrencyDollar,
  HiUserAdd,
  HiOutlineLightBulb,
} from "react-icons/hi";

const menu = [
  {
    title: "Home",
    href: "/",
    icon: HiHome,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: HiCurrencyDollar,
    isProtected: true,
  },
  {
    title: "Manage",
    href: "/manage",
    icon: HiUserAdd,
    isProtected: true
  },
  {
    title: "Learn",
    href: "/learn",
    icon: HiOutlineLightBulb,
  },
];

export default menu;
