import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
    <div className="flex justify-between items-center"> {/* Flexbox to arrange company name and logo on opposite sides */}
        <div>
            <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
            <p className='text-sm text-gray-500'>India</p>
        </div>
        <Button className="p-6" variant="outline" size="icon">
            <Avatar>
                <AvatarImage src={job?.company?.logo} />
            </Avatar>
        </Button>
    </div>
    <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
    </div>
    <div className='flex items-center gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
    </div>
</div>

)}
export default LatestJobCards