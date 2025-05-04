import React,{useState, useEffect} from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector , useDispatch} from 'react-redux'; 
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    // console.log(answers)

    const [answers, setAnswers] = useState([]); // Store answers by card id

    

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        const jobId = e.target.value;
        
        setAnswers(prevSelectedIds => {
            // console.log('Previous IDs:', prevSelectedIds); // See the state BEFORE the update
        
            let nextSelectedIds;
            if (isChecked) {
              if(!prevSelectedIds.includes(jobId)){
              nextSelectedIds = [...prevSelectedIds, jobId];
              }
            //   console.log('Adding ID. Next IDs:', nextSelectedIds);
            } else {
              // Remove the cardId
              nextSelectedIds = prevSelectedIds.filter(id => id !== jobId);
            //   /console.log('Removing ID. Next IDs:', nextSelectedIds);
            }
            
            return nextSelectedIds; // Return the new array for React to set state
          });
          console.log(answers);
      };
      const applyMultipleJobs = ()=>{
        answers.forEach((jobId)=>{
            applyJobHandler(jobId);
            fetchSingleJob(jobId);

        })
        
      }
   
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const dispatch = useDispatch();

    const applyJobHandler = async (jobId) => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    
    const fetchSingleJob = async (jobId) => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
            if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
            }
        } catch (error) {
                console.log(error);
        }
    }
    

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
            <button className='text-2xl bg-[#6A38C2] font-bold border-b-2 rounded-lg p-2 m-2' onClick={applyMultipleJobs}>Confirmation for applying multiple jobs</button>

            <div className='grid grid-cols-3 gap-4 my-5'>
                {
                    allJobs.length <= 0 ? <span>No Job Available</span> : allJobs?.slice(0,6).map((job) => 
                        <div key={job?._id}>
                    <LatestJobCards key={job._id} job={job}  />

                        <div>
                            <input type="checkbox" 
                            value={job?._id}
                            onChange={handleCheckboxChange}
                            checked={answers.includes(job?._id)}/>
                            <label htmlFor={job?._id}>Select</label>
                        </div> 
    </div>
                    
                )
                }

            </div>
        </div>
    )
}

export default LatestJobs