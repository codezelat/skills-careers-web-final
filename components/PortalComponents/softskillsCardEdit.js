"use client";
import React, { useState } from "react";
import { FaMedal, FaTimes } from "react-icons/fa";

export default function SoftSkillsCardEdit({ skill, onDelete }) {

    return (
        <div
            className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571]"
        >
            <FaMedal />
            {skill}
            <FaTimes
                onClick={onDelete}
                size={24}
                color="#001571"
                className="ml-2" />
        </div>
    );
}
