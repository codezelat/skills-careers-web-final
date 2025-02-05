"use client";
import React, { useState } from "react";
import { FaMedal } from "react-icons/fa";

export default function ExpertiseCard({ expertise }) {

    return (
        <div
            className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571]"
        >
            <FaMedal />
            {expertise}
        </div>
    );
}
