import React, { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import JobCard from "@/components/JobCard/JobCard";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${base_url}/searchjobs/search_jobs_by_resume`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.Jobs) {
        setJobs(response.data.Jobs);
        if (response.data.Jobs.length > 0) {
          toast.success(`Found ${response.data.Jobs.length} job${response.data.Jobs.length > 1 ? "s" : ""}!`);
        }
      } else {
        setError(response.data.message || "No jobs found");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch jobs. Make sure you have uploaded a resume first.";
      setError(errorMessage);
      setJobs([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Search</h1>
            <p className="text-gray-400">
              AI-powered job matching based on your resume
            </p>
          </div>
          <Button
            onClick={fetchJobs}
            disabled={isLoading}
            variant="outline"
            className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">
                    Searching for jobs...
                  </p>
                  <p className="text-sm text-gray-500">
                    Analyzing your resume and finding the best matches
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          /* Error State */
          <Card className="bg-neutral-900 border border-red-500/30">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">
                    {error}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Please make sure you have uploaded your resume first
                  </p>
                  <Button
                    onClick={fetchJobs}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          /* Empty State */
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <FileText className="w-12 h-12 text-gray-600" />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">
                    No jobs found
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Try uploading or updating your resume to get better matches
                  </p>
                  <Button
                    onClick={fetchJobs}
                    variant="outline"
                    className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Jobs List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Found {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </h2>
            </div>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <JobCard key={job.job_id || index} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
