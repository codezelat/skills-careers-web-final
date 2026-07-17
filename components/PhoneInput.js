"use client";
import React, { useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

/**
 * Normalize phone number for react-phone-input-2
 * Converts local format (0771234567) to international (94771234567)
 * so the library can parse and display it correctly
 */
function normalizePhoneForInput(value, defaultCountryCode = "94") {
  if (!value) return "";
  let cleaned = value.toString().trim();
  // Already has country code (e.g. +94771234567 or 94771234567)
  if (cleaned.startsWith("+")) {
    return cleaned.substring(1); // react-phone-input-2 wants digits without +
  }
  // Starts with 0 → local Sri Lankan format, replace leading 0 with country code
  if (cleaned.startsWith("0") && cleaned.length >= 9) {
    return defaultCountryCode + cleaned.substring(1);
  }
  // Already digits with country code
  if (cleaned.startsWith(defaultCountryCode)) {
    return cleaned;
  }
  return cleaned;
}

/**
 * Reusable Phone Input Component with country code selection and flags
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Phone number value
 * @param {Function} props.onChange - onChange handler that receives the phone number
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.error - Error message to display
 * @param {string} props.label - Label for the input
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.containerClass - Additional classes for container
 * @param {string} props.inputClass - Additional classes for input
 */
export default function PhoneNumberInput({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  disabled = false,
  error = "",
  label = "",
  required = false,
  containerClass = "",
  inputClass = "",
}) {
  const normalizedValue = useMemo(() => normalizePhoneForInput(value), [value]);

  return (
    <div className={`${containerClass}`}>
      {label && (
        <label className="block text-sm font-semibold text-[#001571] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <PhoneInput
        country={"lk"} // Default to Sri Lanka
        value={normalizedValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        enableSearch={true}
        searchPlaceholder="Search country"
        countryCodeEditable={false}
        containerClass="phone-input-container"
        inputClass={`phone-input-field ${
          error ? "border-red-500" : ""
        } ${inputClass}`}
        buttonClass="phone-input-dropdown"
        dropdownClass="phone-input-dropdown-list"
        searchClass="phone-input-search"
        containerStyle={{
          width: "100%",
        }}
        inputStyle={{
          width: "100%",
          height: "48px",
          fontSize: "14px",
          borderRadius: "0.75rem",
          border: error ? "1px solid #ef4444" : "1px solid #B0B6D3",
          paddingLeft: "48px",
        }}
        buttonStyle={{
          border: error ? "1px solid #ef4444" : "1px solid #B0B6D3",
          borderRadius: "0.75rem 0 0 0.75rem",
          backgroundColor: "white",
        }}
        dropdownStyle={{
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
