import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import downward arrow icon

export const countries = [
  { value: "US", label: "United States", code: "us" },
  { value: "CA", label: "Canada", code: "ca" },
  { value: "GB", label: "United Kingdom", code: "gb" },
  { value: "FR", label: "France", code: "fr" },
  { value: "DE", label: "Germany", code: "de" },
  { value: "IN", label: "India", code: "in" },
];

export default function Countries() {
  const [selectedCountry, setSelectedCountry] = useState(null); // Changed default to null for better handling
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col px-0 pb-2 pt-1 lg:px-0 md:px-0 sm:px-0 relative">
      <div className="w-full">
        <div className="relative" ref={dropdownRef}>
          {/* Dropdown button */}
          <button
            onClick={toggleDropdown}
            className="w-auto lg:w-auto bg-[#e6e8f1] border-2 border-[#B0B6D3] text-[#5462A0] px-4 py-3 lg:px-20 lg:py-3 font-semibold rounded-md flex items-center justify-between"
          >
            <span className="flex items-center">
              {selectedCountry ? (
                <>
                  {selectedCountry.label} {/* Country label */}
                  <Image
                    src={`https://flagcdn.com/w40/${selectedCountry.code}.png`}
                    alt={`${selectedCountry.label} flag`}
                    width={20}
                    height={15}
                    className="mx-2" // Adds space between text and flag
                  />
                </>
              ) : (
                "Select a Country"
              )}
              <FaChevronDown className="ml-2" /> {/* Downward arrow icon */}
            </span>
          </button>
          {/* Dropdown options */}
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 rounded-md mt-2 z-10 w-full">
              {countries.map((country) => (
                <div
                  key={country.value}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(country)}
                >
                  <Image
                    src={`https://flagcdn.com/w40/${country.code}.png`}
                    alt={`${country.label} flag`}
                    width={20}
                    height={15}
                    className="mr-2"
                  />
                  {country.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
