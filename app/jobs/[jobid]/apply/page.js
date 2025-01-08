import ApplicationForm from "./JobApplicationForm";

async function JobApply({params}){
    const jobid = (await params).jobid;
    return (
        <div>
            <ApplicationForm jobid={jobid}/>
        </div>
    )
}

export default JobApply;