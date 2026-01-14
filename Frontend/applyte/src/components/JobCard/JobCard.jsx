import React, { useState } from "react";
import {
  MapPin,
  Building2,
  ExternalLink,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import AddApplicationDialog from "@/components/AddApplicationDialog/AddApplicationDialog";

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false);

  // Map RapidAPI fields to expected format
  const title = job.job_title || job.title || "Job Title";
  const company = job.employer_name || job.company || "Company Name";
  const location = job.job_city && job.job_country
    ? `${job.job_city}, ${job.job_country}`
    : job.job_city || job.job_country || job.location || "Location not specified";

  // Determine job type (Remote/Onsite/Hybrid)
  const getJobType = () => {
    if (job.job_is_remote) return "Remote";
    if (job.job_employment_type) {
      const type = job.job_employment_type.toLowerCase();
      if (type.includes("hybrid")) return "Hybrid";
      if (type.includes("remote")) return "Remote";
    }
    return "Onsite";
  };
  const jobType = getJobType();

  // Extract platform from apply URL or use default
  const getPlatform = () => {
    const applyUrl = job.job_apply_link || job.applyUrl || "";
    if (applyUrl.includes("indeed.com")) return "Indeed";
    if (applyUrl.includes("linkedin.com")) return "LinkedIn";
    if (applyUrl.includes("glassdoor.com")) return "Glassdoor";
    if (applyUrl.includes("monster.com")) return "Monster";
    if (applyUrl.includes("ziprecruiter.com")) return "ZipRecruiter";
    return "Job Board";
  };
  const platform = getPlatform();

  const description = job.job_description || job.description || "";
  const applyUrl = job.job_apply_link || job.applyUrl || "";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const postedDate = formatDate(job.job_posted_at);

  // Format salary if available
  const formatSalary = () => {
    if (job.job_min_salary || job.job_max_salary) {
      const currency = job.job_salary_currency || "USD";
      const min = job.job_min_salary;
      const max = job.job_max_salary;
      if (min && max) {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
      }
      return `${currency} ${(min || max).toLocaleString()}`;
    }
    return null;
  };

  const salary = formatSalary();

  return (
    <Card className="bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-950/30 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-xl mb-3 line-clamp-2">
              {title}
            </CardTitle>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
              {company && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 flex-shrink-0 text-yellow-500" />
                  <span className="truncate">{company}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-yellow-500" />
                  <span className="truncate">{location}</span>
                </div>
              )}

              <Badge
                variant="outline"
                className={`border ${jobType === "Remote"
                  ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                  : "border-neutral-800 text-gray-400 bg-neutral-900"
                  }`}
              >
                <Briefcase className="w-3 h-3 mr-1" />
                {jobType}
              </Badge>

              <Badge
                variant="outline"
                className="border-neutral-800 text-gray-300 bg-neutral-900"
              >
                <Globe className="w-3 h-3 mr-1" />
                {platform}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              {postedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Posted {postedDate}</span>
                </div>
              )}
              {salary && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-400">{salary}</span>
                </div>
              )}
            </div>
          </div>

          {applyUrl && (
            <Button
              onClick={() => setIsApplyDialogOpen(true)}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          )}
        </div>
      </CardHeader>

      {description && (
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Job Description
              </h3>
              <div
                className={`text-gray-300 text-sm ${isExpanded ? "" : "line-clamp-4"
                  } transition-all duration-200`}
                style={{
                  maxHeight: isExpanded ? "none" : "6rem",
                  overflow: "hidden",
                }}
              >
                {description}
              </div>
              {description.length > 200 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Required Skills */}
            {job.job_required_skills && job.job_required_skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.job_required_skills.slice(0, 8).map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.job_required_skills.length > 8 && (
                    <Badge
                      variant="outline"
                      className="border-neutral-800 text-gray-400 bg-neutral-900 text-xs"
                    >
                      +{job.job_required_skills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Apply Confirmation Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Apply to Job</DialogTitle>
            <DialogDescription className="text-gray-400">
              You're about to open the application page for this job. After you apply, would you like to track this application?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300 mb-4">
              <strong>{title}</strong> at <strong>{company}</strong>
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsApplyDialogOpen(false);
                window.open(applyUrl, "_blank", "noopener,noreferrer");
              }}
              className="border-neutral-700 text-gray-300 hover:bg-neutral-800 w-full sm:w-auto"
            >
              Just Open Link
            </Button>
            <Button
              onClick={() => {
                setIsApplyDialogOpen(false);
                window.open(applyUrl, "_blank", "noopener,noreferrer");
                // Open add application dialog after a short delay
                setTimeout(() => {
                  setIsAddApplicationOpen(true);
                }, 500);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Open & Track
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Application Dialog (pre-filled with job data) */}
      <AddApplicationDialog
        isOpen={isAddApplicationOpen}
        onClose={() => setIsAddApplicationOpen(false)}
        onSuccess={() => {
          setIsAddApplicationOpen(false);
          toast.success("Application tracked successfully!");
        }}
        initialData={{
          jobTitle: title,
          companyName: company,
          location: location,
          jobPlatform: platform,
          applicationUrl: applyUrl,
          dateApplied: new Date().toISOString(),
        }}
      />
    </Card>
  );
};

export default JobCard;
