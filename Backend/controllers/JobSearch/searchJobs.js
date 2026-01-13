const axios = require("axios");
const { generateQuery } = require("../AI/functionality");
const { Resume } = require("../../models/resume");
const { User } = require("../../models/user");
const { extractJsonStringAdvanced } = require("../../utils/extractJsonHelper");

const searchJobs = async (req, res) => {
  try {
    const userID = req._id;
    
    // Get user and check if they have resumes
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if user has any resumes
    if (!user.resume || user.resume.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resume found! Please upload a resume first.",
      });
    }

    // Get the most recent resume (last one in array)
    const resumeId = user.resume[user.resume.length - 1];
    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }

    const resumeData = JSON.stringify(resume);
    const query = await generateQuery(resumeData);

    const cleanquery = JSON.parse(extractJsonStringAdvanced(query));
    if (!cleanquery.optimized_query) {
      return res.status(400).json({
        success: false,
        message: "Invalid search query generated!",
      });
    }

    console.log("Generated query:", cleanquery.optimized_query);

    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: cleanquery.optimized_query,
        page: '1',
        num_pages: '5',
        date_posted: "all",
        employment_types: "FULLTIME,PARTTIME,CONTRACTOR",
        remote: "true",
        sort: "relevance",
      },
      headers: {
        "x-rapidapi-key": "e081346a3cmsh8a66ab0746ec450p1a8241jsn3759626313ec",
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
      timeout: 15000,
    };

    const response = await axios.request(options);

    if (!response.data || !response.data.data) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch jobs!",
      });
    }

    const jobs = response.data.data;
    console.log(`Found ${jobs.length} jobs`);

    return res.status(200).json({
      success: true,
      message: "Jobs searched successfully!",
      Jobs: jobs,
    });
  } catch (e) {
    console.error("Error in the search jobs: ", e.response?.data || e.message);
    return res.status(500).json({
      success: false,
      message: "Error in searching jobs!",
    });
  }
};

module.exports = {
  searchJobs,
};
