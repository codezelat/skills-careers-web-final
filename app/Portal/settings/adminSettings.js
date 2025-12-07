"use client";
import { useState } from "react";
import PasswordReset from "@/components/PortalComponents/passwordReset";

export default function AdminSettings() {
    const [showResetPassword, setShowResetPassword] = useState(false);

    return (
        <div className="bg-white rounded-3xl py-7 px-7 min-h-screen">
            <h1 className="font-bold text-xl mb-10 text-[#001571]">Settings</h1>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#001571] mb-6">Security</h2>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-500">Change your account password securely.</p>
                    </div>
                    <button
                        onClick={() => setShowResetPassword(true)}
                        className="py-2 px-6 rounded-xl bg-[#001571] text-white font-medium shadow-md hover:bg-blue-800 transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {showResetPassword && (
                <PasswordReset onClose={() => setShowResetPassword(false)} />
            )}
        </div>
    );
}
