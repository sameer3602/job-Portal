import React, { useState } from 'react';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  
  const [feedbacks, setFeedbacks] = useState({});
  const [showForm, setShowForm] = useState({});

  const toggleForm = (id) => {
    setShowForm(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFeedbackChange = (id, value) => {
    setFeedbacks(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    console.log("Submitted:", feedbacks[id]);
    toggleForm(id); // close the form
  };

  const statusHandler = async (status, id) => {
    try {
      const feedback = feedbacks[id] || "";
      console.log(feedback);
      axios.defaults.withCredentials = true;

      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, {
        status,
        feedback,
      });
      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.applications?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullname}</TableCell>
              <TableCell>{item?.applicant?.email}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber}</TableCell>
              <TableCell>
                {item.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600 cursor-pointer"
                    href={item?.applicant?.profile?.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.applicant?.profile?.resumeOriginalName}
                  </a>
                ) : (
                  <span>NA</span>
                )}
              </TableCell>
              <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
              <TableCell>{item?.status}</TableCell>
              <TableCell>
                <div className="p-2 max-w-md mx-auto">
                  <button
                    onClick={() => toggleForm(item._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    {showForm[item._id] ? "Close Form" : "Open Form"}
                  </button>

                  {showForm[item._id] && (
                    <form onSubmit={(e) => handleSubmit(e, item._id)} className="mt-2 border p-2 rounded shadow">
                      <label className="block text-sm text-gray-700 mb-1">Enter feedback:</label>
                      <input
                        type="text"
                        value={feedbacks[item._id] || ""}
                        onChange={(e) => handleFeedbackChange(item._id, e.target.value)}
                        className="w-full border px-2 py-1 mb-2 rounded"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </TableCell>
              <TableCell className="float-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        key={index}
                        onClick={() => statusHandler(status, item._id)}
                        className="flex w-fit items-center my-2 cursor-pointer hover:underline"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
