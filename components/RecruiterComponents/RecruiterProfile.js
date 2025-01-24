import { useEffect, useState } from "react";

function RecruiterProfile({ recruiter }) {
  const [recruiterDetails, setRecruiterDetails] = useState(recruiter);

  useEffect(() => {
    if (recruiter) {
      setRecruiterDetails(recruiter);
    }
  }, [recruiter]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/recruiter/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recruiterDetails),
      });

      if (response.ok) {
        alert("Recruiter details updated successfully!");
      } else {
        alert("Failed to update recruiter details");
      }
    } catch (error) {
      console.error("Error updating recruiter:", error);
    }
  };

  return (
    <>
      <div>
        <div className="relative">
          {/* Background Image */}
          <Image
            src="/images/recruiterbg.png"
            alt="Background"
            width={1200}
            height={300}
            className="w-full h-32 sm:h-48 object-cover"
          />
          {/* Edit Image */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full overflow-hidden w-[30px] sm:w-[30px] h-[30px] sm:h-[30px] flex items-center justify-center shadow-md">
            <Image
              src="/images/miyuri_img/editiconwhite.png"
              alt="Edit Icon"
              width={40}
              height={40}
            />
          </div>
          {/* Profile Image */}
          <div className="relative">
            {/* DP Image */}
            <div className="absolute transform -mt-10 sm:-mt-16 ml-4 sm:ml-10 lg:ml-20 border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] flex items-center justify-center">
              <Image
                src={recruiterDetails.logo}
                alt="Profile"
                width={300}
                height={190}
                className="fill"
              />
            </div>

            {/* Edit Icon */}
            <div className="absolute -top-9 left-[200px] transform translate-x-1/2 -translate-y-1/2 w-20 h-8 sm:w-10 sm:h-30  rounded-full  items-center justify-center shadow-md">
              <Image
                src="/images/miyuri_img/editiconwhite.png"
                alt="Edit Icon"
                width={40}
                height={20}
              />
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900">
          <FaLinkedin size={20} className="cursor-pointer" />
          <FaTwitter size={20} className="cursor-pointer" />
          <FaInstagram size={20} className="cursor-pointer" />
          <FaFacebook size={20} className="cursor-pointer" />
          <FaGithub size={20} className="cursor-pointer" />
          <FaDribbble size={20} className="cursor-pointer" />
        </div>

        {/* Profile Info */}
        <div className="p-4 sm:p-10 text-left mt-20">
            <div >
              <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                {recruiterDetails.recruiterName || "N/A"}{" "}
                <span className="text-blue-500">✓</span>
              </h3>

              {/* Container for details and Apply Now button */}
              <div className="flex flex-col lg:flex-row sm:flex-col md:flex-row justify-between items-start sm:items-start mt-4  gap-4">
                {/* Details section */}
                <div className="flex flex-col lg:flex-row sm:flex-col md:flex-col sm:gap-8 items-start sm:items-start">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/location.png"
                      alt="location"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.location}
                    </p>
                  </div>
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/category.png"
                      alt="industry"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.industry || "N/A"}
                    </p>
                  </div>
                  {/* Employee Range */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/user-octagon.png"
                      alt="employees"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.employeeRange || "N/A"}
                    </p>
                  </div>
                </div>
                {/* Edit Button */}
                <div>
                  <button
                    onClick={handleUpdate}
                    className=" text-white   px-3 py-2 sm:px-4 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/miyuri_img/editicon.png"
                        alt="arrow"
                        width={50}
                        height={16}
                      />
                    </div>
                  </button>
                </div>
              </div>
              <h3 className="mt-5 text-blue-900 text-lg sm:text-xl font-bold">
                Company Description
              </h3>
              <p className="text-gray-800 mt-4 sm:mt-8 mb-4 sm:mb-6 font-sans">
                {recruiterDetails.companyDescription || "N/A"}
              </p>
            </div>
        </div>

      </div>
    </>
  );
}

export default RecruiterProfile;
