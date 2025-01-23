"use client"
import JobPost from '@/components/adminPortal/jobs/jobPost';
import { useRouter } from 'next/router';

const JobPostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <JobPost jobId={id} />;
};

export default JobPostPage;
