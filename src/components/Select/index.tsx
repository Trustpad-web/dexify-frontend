import { useEffect, useRef, useState } from "react";
import useOutsideClickHandler from "../../hooks/useOutsideClickHandler";
export type ItemType = {
  label: string;
  value: string | number;
};

export default function Select({
  items,
  value,
  onChange,
}: {
  items: ItemType[];
  value: string | number;
  onChange: (value: any) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleTriggerClick = () => {
    setOpen(!open);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClickHandler(wrapperRef, () => setOpen(false));

  const [selected, setSelected] = useState<ItemType>();

  useEffect(() => {
    const selectedItem = items.find(item => item.value === value);
    setSelected(selectedItem);
  }, [value, items])

  const handleChanged = (item: ItemType) => {
    onChange(item.value);
    setOpen(false);
    setSelected(item);
  };

  return (
    <div className="relative w-fit" ref={wrapperRef}>
      <button
        id="dropdownRadioButton"
        data-dropdown-toggle="dropdownRadio"
        className="inline-flex items-center text-title bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
        onClick={handleTriggerClick}
      >
        <svg
          className="w-4 h-4 mr-2 text-gray-400"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          ></path>
        </svg>
        {selected?.label}
        <svg
          className="w-3 h-3 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div
        id="dropdownRadio"
        className={`z-10 ${
          open ? "block" : "hidden"
        } bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 w-full`}
        data-popper-reference-hidden=""
        data-popper-escaped=""
        data-popper-placement="top"
        style={{
          position: "absolute",
          margin: 0,
        }}
      >
        <ul
          className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownRadioButton"
        >
          {items.map((item) => (
            <li
              key={`select-dropdown-${item.value}`}
              onClick={() => handleChanged(item)}
            >
              <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <input
                  id={`filter-radio-${item.value}`}
                  type="radio"
                  value={(selected?.value === item.value) ? "true" : "off"}
                  name="filter-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-transparent dark:focus:ring-transparent dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`filter-radio-${item.value}`}
                  className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                >
                  {item?.label}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
