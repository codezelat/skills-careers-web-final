import React, { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";

export default function DropdownButton({ 
  buttonName, 
  dropdownItems, 
  onSelect,
  selected 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSelect = (item) => {
    onSelect?.(item);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Filter items based on search term
  const filteredItems = dropdownItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        className="flex bg-[#001571] w-full text-white px-4 py-4 rounded-lg justify-between items-center hover:bg-[#001571]/90 transition-colors"
        onClick={toggleDropdown}
      >
        {/* Show selected value or default button name */}
        <span className="truncate">{selected || buttonName}</span>
        <span className="ml-2 flex-shrink-0">
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-xl z-50">
          {/* Search Input - Only show if more than 5 items */}
          {dropdownItems.length > 5 && (
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                <IoSearchSharp className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          
          {/* Scrollable List */}
          <ul className="text-gray-800 max-h-64 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <li
                  key={index}
                  className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${
                    selected === item ? "bg-blue-100 font-semibold text-[#001571]" : ""
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-500 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};