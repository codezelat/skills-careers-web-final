import Link from 'next/link';

function AppliedJobs({ appliedJob }) {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Job Title</p>
          <p className="font-semibold">{appliedJob.jobTitle || 'Not Available'}</p>
        </div>
         
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Recruiter</p>
          <p className="font-semibold">{appliedJob.recruiterName || 'Not Available'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Applied Date</p>
          <p className="font-semibold">{formatDate(appliedJob.appliedAt)}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Status</p>
          <span className={`px-2 py-1 rounded-full text-sm font-medium
            ${appliedJob.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              appliedJob.status === 'Approved' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'}`}>
            {appliedJob.status || 'Pending'}
          </span>
        </div>
        
        <div className="flex justify-end">
          <Link href={`/jobs/${appliedJob.jobId}`}>
            <button className="px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white rounded transition-colors">
              View Job
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppliedJobs;