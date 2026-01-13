const express = require("express");
const { isAuthorized } = require("../middlewares/auth");
const { searchJobs } = require("../controllers/JobSearch/searchJobs");
const router = express.Router();

router.get("/search_jobs_by_resume", isAuthorized, searchJobs);

module.exports = router;