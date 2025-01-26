import JobPost from '@/components/adminPortal/jobs/jobPost';
import { useParams } from 'next/navigation';

const JobPostPage = () => {
  const { id } = useParams();

  if (!id) return <p>Loading...</p>;

  return <JobPost jobId={id} />;
};

export default JobPostPage;