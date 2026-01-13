import React, { useState } from "react";
import { Search, MapPin, Briefcase, Building2, ExternalLink, Loader2, AlertCircle, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setHasSearched(true);

      const response = await axios.get(
        `${base_url}/jobSearch/search_jobs_by_resume`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.Jobs) {
        setJobs(response.data.Jobs);
        toast.success(`Found ${response.data.Jobs.length} jobs!`);
      } else {
        toast.error(response.data.message || "No jobs found");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error searching jobs:", error);
      toast.error(
        error.response?.data?.message || "Failed to search jobs. Make sure you have uploaded a resume first."
      );
      setJobs([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatSalary = (minSalary, maxSalary, currency = "USD") => {
    if (!minSalary && !maxSalary) return "Not specified";
    if (minSalary && maxSalary) {
      return `${currency} ${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`;
    }
    return `${currency} ${(minSalary || maxSalary).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Job Search</h1>
          <p className="text-gray-400">
            Find jobs that match your resume using AI-powered matching
          </p>
        </div>

        {/* Search Section */}
        <Card className="bg-neutral-900 border border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Jobs
            </CardTitle>
            <CardDescription className="text-gray-400">
              We'll analyze your resume and find the best matching jobs for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1 md:flex-none"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Make sure you have uploaded your resume first
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        {isSearching ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <p className="text-gray-400">Searching for jobs...</p>
              </div>
            </CardContent>
          </Card>
        ) : hasSearched && jobs.length === 0 ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400">No jobs found</p>
                <p className="text-sm text-gray-500">
                  Try uploading or updating your resume to get better matches
                </p>
              </div>
            </CardContent>
          </Card>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Found {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </h2>
            </div>
            {jobs.map((job, index) => (
              <Card
                key={index}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2">
                        {job.job_title || "Job Title"}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        {job.employer_name && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.employer_name}</span>
                          </div>
                        )}
                        {job.job_city && job.job_country && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {job.job_city}, {job.job_country}
                            </span>
                          </div>
                        )}
                        {job.job_is_remote && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-green-400">Remote</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {job.job_apply_link && (
                      <Button
                        onClick={() => window.open(job.job_apply_link, "_blank")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {job.job_min_salary || job.job_max_salary ? (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {formatSalary(
                              job.job_min_salary,
                              job.job_max_salary,
                              job.job_salary_currency
                            )}
                          </span>
                        </div>
                      ) : null}
                      {job.job_employment_type && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            {job.job_employment_type}
                          </span>
                        </div>
                      )}
                      {job.job_posted_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            Posted {formatDate(job.job_posted_at)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Job Description */}
                    {job.job_description && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">
                          Description
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-3">
                          {job.job_description.substring(0, 300)}
                          {job.job_description.length > 300 && "..."}
                        </p>
                      </div>
                    )}

                    {/* Required Skills */}
                    {job.job_required_skills && job.job_required_skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.job_required_skills.slice(0, 10).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.job_required_skills.length > 10 && (
                            <span className="px-3 py-1 rounded-full bg-neutral-800 text-gray-400 text-xs">
                              +{job.job_required_skills.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-3">
                <Search className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400">Ready to search for jobs</p>
                <p className="text-sm text-gray-500">
                  Click the search button above to find jobs matching your resume
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
