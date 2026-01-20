"use client";
import React, { useState, useEffect } from "react";

/**
 * Custom time input component that displays AM/PM format consistently across all environments
 * @param {string} value - Time value in 24-hour format (HH:mm)
 * @param {function} onChange - Callback function when time changes
 * @param {string} name - Input name attribute
 * @param {boolean} required - Whether the input is required
 * @param {string} className - Additional CSS classes
 */
export default function TimeInput({
  value,
  onChange,
  name,
  required = false,
  className = "",
}) {
  // Parse 24-hour format to hour, minute, and period
  const parseTime = (time24) => {
    if (!time24) return { hour: "", minute: "", period: "AM" };

    const [hours, minutes] = time24.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return {
      hour: hour.toString(),
      minute: minutes || "",
      period,
    };
  };

  const initialTime = parseTime(value);
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);

  // Sync with external value changes
  useEffect(() => {
    const parsed = parseTime(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  // Convert to 24-hour format for form submission
  const convertTo24Hour = (h, m, p) => {
    if (!h || !m) return "";

    let hour24 = parseInt(h, 10);

    if (p === "PM" && hour24 < 12) {
      hour24 += 12;
    } else if (p === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const handleChange = (field, newValue) => {
    let newHour = hour;
    let newMinute = minute;
    let newPeriod = period;

    if (field === "hour") {
      newHour = newValue;
      setHour(newValue);
    } else if (field === "minute") {
      newMinute = newValue;
      setMinute(newValue);
    } else if (field === "period") {
      newPeriod = newValue;
      setPeriod(newValue);
    }

    // Trigger onChange if we have valid hour and minute
    if (newHour && newMinute) {
      const time24 = convertTo24Hour(newHour, newMinute, newPeriod);

      onChange({
        target: {
          name,
          value: time24,
          type: "time",
        },
      });
    }
  };

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // Generate minute options (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Hour */}
      <select
        value={hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        className="block w-1/3 border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#001571] focus:border-transparent"
        required={required}
      >
        <option value="">Hour</option>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      {/* Minute */}
      <select
        value={minute}
        onChange={(e) => handleChange("minute", e.target.value)}
        className="block w-1/3 border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#001571] focus:border-transparent"
        required={required}
      >
        <option value="">Min</option>
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* AM/PM */}
      <select
        value={period}
        onChange={(e) => handleChange("period", e.target.value)}
        className="block w-1/3 border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#001571] focus:border-transparent"
        required={required}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
