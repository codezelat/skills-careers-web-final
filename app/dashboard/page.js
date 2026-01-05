// "use client";
// import { signOut, useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { handleOpenForm, handleCloseForm } from "@/handlers";
// import CreateJobPost from "@/components/jobForm";
// import JobCard from "@/components/jobCard";

// function DashBoard() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   console.log(status);

//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [recruiterDetails, setRecruiterDetails] = useState({
//     id: "",
//     recruiterName: "",
//     employeeRange: "",
//     email: "",
//     contactNumber: "",
//     website: "",
//     companyDescription: "",
//     industry: "",
//     location: "",
//     logo: "",
//     facebook: "",
//     instagram: "",
//     linkedin: "",
//     x: "",
//   });
//   const [jobs, setJobs] = useState([]);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login"); // Redirect to login if unauthenticated
//     }
//   }, [status, router]);

//   useEffect(() => {
//     if (session?.user?.email) {
//       const fetchRecruiterDetails = async (e) => {
//         try {
//           const response = await fetch(
//             `/api/recruiterdetails/get?id=${session.user.id}`
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setRecruiterDetails(data);
//           } else {
//             console.error("Failed to fetch recruiter details");
//           }
//         } catch (error) {
//           console.error("Error fetching recruiter details:", error);
//         }
//       };
//       fetchRecruiterDetails();
//     }
//   }, [session]);

//   useEffect(() => {
//     if (recruiterDetails.id) {
//       const fetchJobs = async () => {
//         try {
//           const response = await fetch(
//             `/api/job/all?id=${recruiterDetails.id}`
//           );
//           if (!response.ok) {
//             throw new Error("Failed to fetch jobs.");
//           }
//           const data = await response.json();
//           setJobs(data.jobs);
//         } catch (err) {
//           setError(err.message);
//         }
//       };
//       fetchJobs();
//     }
//   }, [recruiterDetails.id]);

//   const handleImageChange = async (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     if (!file) return;

//     // Check file size (limit to 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert("File size should be less than 5MB");
//       return;
//     }

//     // Check file type
//     if (!file.type.startsWith("image/")) {
//       alert("Please upload an image file");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("email", session.user.email);

//       console.log("Starting image upload...");
//       const response = await fetch("/api/recruiterdetails/uploadimage", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to upload image");
//       }

//       console.log("Upload successful:", data);
//       setRecruiterDetails((prev) => ({
//         ...prev,
//         logo: data.imageUrl,
//       }));

//       alert("Logo uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert(`Failed to upload image: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       <button
//         onClick={() => signOut({ callbackUrl: "/login" })}
//         className="border-double border-4 border-red-500 mx-5"
//       >
//         Sign out
//       </button>

//       {session ? (
//         <div>
//           <p>Id: {session.user.id}</p>
//           <p>User: {recruiterDetails.recruiterName}</p>
//           <p>Email: {session.user.email}</p>

//           <div className="mt-4 mb-6">
//             {recruiterDetails.logo ? (
//               <div className="relative w-32 h-32">
//                 <Image
//                   src={recruiterDetails.logo}
//                   alt="Logo"
//                   fill
//                   className="rounded-full object-cover"
//                   sizes="128px"
//                   onError={(e) => {
//                     console.error("Error loading image:", e);
//                     // Optionally set a fallback image
//                     e.target.src = "/fallback-logo-image.png"; // Make sure to add a fallback image in your public folder
//                   }}
//                 />
//               </div>
//             ) : (
//               <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
//                 <span className="text-gray-500">No Image</span>
//               </div>
//             )}

//             <div className="mt-2">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//                 id="logo-image-input"
//               />
//               <label
//                 htmlFor="logo-image-input"
//                 className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 {recruiterDetails.logo ? "Change Logo" : "Upload Logo"}
//               </label>
//             </div>
//           </div>

//           <Link href="/dashboard/edit" className="text-green-700">
//             Edit Profile
//           </Link>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}

//       <button
//         onClick={handleOpenForm(setIsFormVisible)}
//         className="border-double border-4 border-green-500"
//       >
//         Add Job
//       </button>
//       <br />

//       {isFormVisible && (
//         <CreateJobPost
//           onClose={handleCloseForm(setIsFormVisible)}
//           recruiterId={recruiterDetails.id}
//         />
//       )}

//       {/* <div className="bg-gray-300">
//         <h1>DashBoard Details</h1>
//         <div>
//           <p>Recruiter Name: {recruiterDetails.recruiterName}</p>
//           <p>Employee Range: {recruiterDetails.employeeRange}</p>
//           <p>Email: {recruiterDetails.email}</p>
//           <p>Contact Number: {recruiterDetails.contactNumber}</p>
//           <p>Website: {recruiterDetails.website}</p>
//           <p>Company Description: {recruiterDetails.companyDescription}</p>
//           <p>Industry: {recruiterDetails.industry}</p>
//           <p>Location: {recruiterDetails.location}</p>
//           <p>Facebook: {recruiterDetails.facebook}</p>
//           <p>Instagram: {recruiterDetails.instagram}</p>
//           <p>LinkedIn: {recruiterDetails.linkedin}</p>
//           <p>X: {recruiterDetails.x}</p>
//         </div>
//       </div> */}

//       <h1>Open Jobs</h1>
//       <div className="grid grid-cols-4 gap-4">
//         {jobs.length > 0 ? (
//           jobs.map((job, index) => <JobCard key={index} job={job} />)
//         ) : (
//           <p>No jobs available for this recruiter.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashBoard;

"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handleOpenForm, handleCloseForm } from "@/lib/handlers";
import CreateJobPost from "@/components/jobForm";
import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";
import PostedJob from "./postedjobcard";

function DashBoard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(status);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
    recruiterName: "",
    employeeRange: "",
    email: "",
    contactNumber: "",
    website: "",
    companyDescription: "",
    industry: "",
    location: "",
    logo: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
  });
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchRecruiterDetails = async () => {
        try {
          const response = await fetch(
            `/api/recruiterdetails/get?id=${session.user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      };
      fetchRecruiterDetails();
    }
  }, [session]);

  useEffect(() => {
    if (recruiterDetails.id) {
      const fetchJobs = async () => {
        try {
          const response = await fetch(
            `/api/job/all?recruiterId=${recruiterDetails.id}&showAll=true`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch jobs.");
          }
          const data = await response.json();
          setJobs(data.jobs);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching jobs:", err);
        }
      };
      fetchJobs();
    }
  }, [recruiterDetails.id]);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", session.user.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/recruiterdetails/uploadimage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setRecruiterDetails((prev) => ({
        ...prev,
        logo: data.imageUrl,
      }));

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-5 px-4 pb-8 pt-16 sm:px-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            Sign out
          </button>
        </div>

        {session ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2">
                  {recruiterDetails.logo ? (
                    <Image
                      src={recruiterDetails.logo}
                      alt="Logo"
                      width={100}
                      height={100}
                      className="rounded-full object-cover mb-4 shadow-lg"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.target.src = "/fallback-logo-image.png";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="logo-image-input"
                    />
                    <label
                      htmlFor="logo-image-input"
                      className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
                    >
                      {recruiterDetails.logo ? "Change Logo" : "Upload Logo"}
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-xl font-semibold">
                    {recruiterDetails.recruiterName}
                  </p>
                  <p className="text-gray-600">{session.user.email}</p>
                  <Link
                    href="/dashboard/edit"
                    className="text-green-500 hover:text-green-700 hover:underline inline-block mt-2"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Open Jobs</h2>
                <button
                  onClick={handleOpenForm(setIsFormVisible)}
                  className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
                >
                  Add Job
                </button>
              </div>

              {isFormVisible && (
                <CreateJobPost
                  onClose={handleCloseForm(setIsFormVisible)}
                  recruiterId={recruiterDetails.id}
                />
              )}

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="grid grid-cols-1">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => <PostedJob key={index} job={job} />)
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-4">
                    No jobs posted yet. Click Add Job to post your first job.
                  </p>
                )}
              </div>

              {/* <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {jobs.length > 0 ? (
                jobs.map((job, index) => <JobCard key={index} job={job} />)
              ) : (
                <p className="col-span-full text-center text-gray-500 py-4">
                  No jobs posted yet. Click Add Job to post your first job.
                </p>
              )}
            </div> */}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">Loading...</div>
        )}
      </div>
    </>
  );
}

export default DashBoard;
