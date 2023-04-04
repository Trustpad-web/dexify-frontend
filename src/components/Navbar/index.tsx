import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/slices/theme.slice";

export default function CustomNavbar({
  onClickToggle,
}: {
  onClickToggle: () => void;
}) {
  const handleCollapse = () => {
    onClickToggle();
  };
  const themeMode = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  return (
    <Navbar
      fluid={true}
      rounded={false}
      className="fixed top-0 z-40 w-full px-5"
    >
      <Navbar.Toggle onClick={handleCollapse} />
      <Navbar.Brand href="https://dexify.io/" className="visible md:hidden">
        <img
          src="/imgs/brand_logo.png"
          className="mx-3 h-[24px] md:h-[28px]"
          alt="Flowbite Logo"
        />
      </Navbar.Brand>

      <div className="flex md:order-2 ml-auto mr-3">
        <div className="mr-5 items-center mb-0 flex">
          <DarkModeSwitch
            checked={themeMode.value === "dark"}
            onChange={() => dispatch(toggleTheme())}
            size={22}
          />
        </div>
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded={true}
            />
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
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}
