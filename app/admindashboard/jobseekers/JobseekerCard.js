import Image from "next/image";
import { useEffect, useState } from "react";

function JobseekerCard(props) {
  const {
    _id,
    firstName,
    lastName,
    email,
    contactNumber,
    position,
    personalProfile,
    dob,
    nationality,
    maritalStatus,
    languages,
    religion,
    address,
    ethnicity,
    experience,
    education,
    licensesCertifications,
    softSkills,
    professionalExpertise,
    profileImage,
  } = props.jobseeker;

  const handleViewJobSeeker = () => {
    props.onViewJobSeeker?.();
  };

  return (
    <div className="grid grid-cols-12 gap-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="col-span-1 space-y-1">
        <Image
          src={profileImage || "/images/default-image.jpg"}
          alt="Jobseeker Profile"
          width={50}
          height={50}
          className="rounded-full shadow-lg"
        />
      </div>
      <div className="col-span-2 space-y-1">
        <p className="text-sm text-gray-600">Name</p>
        <p className="font-semibold">{firstName} {lastName}</p>
      </div>
      <div className="col-span-3 space-y-1">
        <p className="text-sm text-gray-600">Email</p>
        <p className="font-semibold">{email}</p>
      </div>
      <div className="col-span-2 space-y-1">
        <p className="text-sm text-gray-600">Contact Number</p>
        <p className="font-semibold">{contactNumber}</p>
      </div>
      <div className="col-span-4 mt-2 flex gap-2 justify-end">
        <button className="px-4 py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded transition-colors">
          Restrict
        </button>
        <button
          className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
          onClick={handleViewJobSeeker}
        >
          View
        </button>
        <button className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobseekerCard;
