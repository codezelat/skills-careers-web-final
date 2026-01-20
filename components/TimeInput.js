"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function TimeInput({ value, onChange, name, required = false }) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("AM");
  
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  // Parse incoming value
  useEffect(() => {
    if (value) {
      const [timePart, periodPart] = value.split(" ");
      const [h, m] = timePart.split(":");
      
      if (periodPart) {
        // Already in 12-hour format
        setHour(h);
        setMinute(m);
        setPeriod(periodPart);
      } else {
        // Convert from 24-hour format
        let hour24 = parseInt(h, 10);
        const newPeriod = hour24 >= 12 ? "PM" : "AM";
        hour24 = hour24 % 12 || 12;
        setHour(hour24.toString());
        setMinute(m);
        setPeriod(newPeriod);
      }
    }
  }, [value]);

  // Memoized function to update parent component
  const updateTime = useCallback((newHour, newMinute, newPeriod) => {
    if (newHour && newMinute) {
      // Convert to 24-hour format for storage
      let hour24 = parseInt(newHour, 10);
      if (newPeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (newPeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      
      const time24 = `${hour24.toString().padStart(2, "0")}:${newMinute}`;
      onChange({ target: { name, value: time24 } });
    }
  }, [name, onChange]);

  const handleHourChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    
    // Limit to 2 digits
    if (val.length > 2) val = val.slice(0, 2);
    
    // Validate range
    if (val) {
      const numVal = parseInt(val, 10);
      if (numVal > 12) val = "12";
      if (numVal < 1 && val.length === 2) val = "01";
    }
    
    setHour(val);
    
    // Auto-advance to minutes when 2 digits entered or value >= 2
    if (val.length === 2 || (val.length === 1 && parseInt(val, 10) >= 2)) {
      minuteRef.current?.focus();
    }
    
    // Update parent if we have all values
    if (val && minute) {
      updateTime(val, minute, period);
    }
  };

  const handleHourBlur = () => {
    // Pad single digit hours and validate
    if (hour) {
      const numHour = parseInt(hour, 10);
      if (numHour >= 1 && numHour <= 12) {
        const paddedHour = numHour.toString();
        setHour(paddedHour);
        if (minute) {
          updateTime(paddedHour, minute, period);
        }
      } else {
        setHour("");
      }
    }
  };

  const handleMinuteChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    
    // Limit to 2 digits
    if (val.length > 2) val = val.slice(0, 2);
    
    // Validate range
    if (val) {
      const numVal = parseInt(val, 10);
      if (numVal > 59) val = "59";
    }
    
    setMinute(val);
    
    // Update parent if we have all values
    if (hour && val.length === 2) {
      const paddedVal = val.padStart(2, "0");
      setMinute(paddedVal);
      updateTime(hour, paddedVal, period);
    }
  };

  const handleMinuteBlur = () => {
    // Pad and validate minutes
    if (minute) {
      const numMinute = parseInt(minute, 10);
      if (numMinute >= 0 && numMinute <= 59) {
        const paddedMinute = numMinute.toString().padStart(2, "0");
        setMinute(paddedMinute);
        if (hour) {
          updateTime(hour, paddedMinute, period);
        }
      } else {
        setMinute("");
      }
    }
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    if (hour && minute) {
      updateTime(hour, minute, newPeriod);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={hourRef}
        type="text"
        inputMode="numeric"
        value={hour}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        placeholder="HH"
        maxLength="2"
        required={required}
        aria-label="Hour"
        className="w-16 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      />
      <span className="text-gray-500 font-semibold">:</span>
      <input
        ref={minuteRef}
        type="text"
        inputMode="numeric"
        value={minute}
        onChange={handleMinuteChange}
        onBlur={handleMinuteBlur}
        placeholder="MM"
        maxLength="2"
        required={required}
        aria-label="Minute"
        className="w-16 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      />
      <select
        value={period}
        onChange={handlePeriodChange}
        required={required}
        aria-label="Period"
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
