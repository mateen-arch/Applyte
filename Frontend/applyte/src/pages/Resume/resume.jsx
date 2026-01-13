import React from "react";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { Store } from "@/store/store";

const Resume = () => {
  const { user } = Store();

  const fetchResume = async () => {
    try {
      const response = await axios.get(`${base_url}/get-resume`,user.id,{
        withCredentials: true
      });

      if (response.data.success)
      {
        
      }
    } catch (e) {}
  };

  const updateResume = () => {};
  const uploadResume = () => {};
  return <div>Resume</div>;
};

export default Resume;
