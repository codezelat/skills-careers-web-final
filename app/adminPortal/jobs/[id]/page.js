"use client"
import JobPost from '@/components/adminPortal/jobs/jobPost';
import { useRouter } from 'next/navigation';

// const JobPostPage = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   if (!id) return <p>Loading...</p>;

//   return <JobPost jobId={id} />;
// };

// export default JobPostPage;

async function JobPostPage({ params }) {
  const id = (await params).id;
  if (!id) return <p>Loading...</p>;
  return (
    <div>
      <JobPost slug={id}/>
    </div>
  );
}

export default JobPostPage;
