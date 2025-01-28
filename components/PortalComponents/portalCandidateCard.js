import Image from "next/image";
import { useEffect, useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function PortalCandidateCard(props, onSelect, isSelected) {

    const router = useRouter();
    const { _id, userId, email, contactNumber } = props.jobseeker;

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        profileImage: "",
    });

    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (userId) {
            const fetchUserDetails = async (e) => {
                try {
                    const response = await fetch(`/api/users/get?id=${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserDetails(data.user);
                    } else {
                        console.error("Failed to fetch user details");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };

            fetchUserDetails();
        }
    }, [_id]);

    const handleViewCandidateProfile = () => {
        router.push(`/Portal/candidates/${_id}`)
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this jobseeker?")) {
            try {
                setIsDeleting(true);
                const response = await fetch(`/api/jobseeker/delete?id=${_id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Jobseeker Deleted Successfully!!!");
                } else {
                    alert("Failed to delete jobseeker...");
                }
            } catch (error) {
                console.error("Error deleting Job:", error);
                alert("Error deleting Jobseeker");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
            {/* Checkbox */}
            <div className="flex items-center px-4 py-3 w-[3%]">
                <input
                    type="checkbox"
                    className="form-checkbox text-[#001571] border-gray-300 rounded"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                />
            </div>
            <div className="flex flex-row space-x-3 w-[24.25%] items-center pl-4">
                {/* Recruiter Logo */}
                <div className="">
                    <Image
                        src={userDetails.profileImage || "/images/default-image.jpg"}
                        alt="Recruiter Logo"
                        width={40}
                        height={40}
                        className="rounded-full shadow-lg"
                    />
                </div>
                {/* Recruiter Name */}
                <div className="items-center">{userDetails.firstName} {userDetails.lastName}</div>
            </div>
            {/* Email */}
            <div className="px-4 py-3 font-semibold w-[24.25%] flex items-center">{email}</div>
            {/* Website */}
            <div className="px-4 py-3 font-semibold w-[24.25%] flex items-center">{contactNumber}</div>
            {/* Actions */}
            <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%] items-center">
                <button
                    className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                    onClick={handleViewCandidateProfile}
                >
                    <span className="mr-2">
                        <RiEdit2Fill size={20} />
                    </span>
                    <span>Edit</span>
                </button>
                <button
                    className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                    type="button"
                    onClick={handleDelete}
                >
                    <span className="mr-2">
                        <RiDeleteBinFill size={20} />
                    </span>
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );

}