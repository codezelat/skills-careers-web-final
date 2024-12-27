import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function DropdownButton({ buttonName, dropdownItems, onSelect }){

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (item) => {
    onSelect?.(item); // Call the onSelect callback with the selected item
    setIsOpen(false); // Close the dropdown after selection
  };

    return (
        <div className="relative w-full">
          {/* Button */}
          <button
            className="flex bg-[#001571] w-full text-white px-4 py-4 rounded-lg justify-between items-center"
            onClick={toggleDropdown}
          >
            {buttonName}
            <span>{isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}</span>
          </button>
    
          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-10">
              <ul className="text-gray-800">
                {dropdownItems.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
  };

