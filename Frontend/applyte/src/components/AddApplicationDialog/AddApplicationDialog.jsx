import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { Store } from "@/store/store";

const AddApplicationDialog = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { user } = Store();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || "",
    companyName: initialData?.companyName || "",
    location: initialData?.location || "",
    jobPlatform: initialData?.jobPlatform || "LinkedIn",
    applicationUrl: initialData?.applicationUrl || "",
    dateApplied: initialData?.dateApplied
      ? new Date(initialData.dateApplied).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    resumeVersion: "",
    coverLetter: "",
    coverLetterType: "none",
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchResumes();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || "",
        companyName: initialData.companyName || "",
        location: initialData.location || "",
        jobPlatform: initialData.jobPlatform || "LinkedIn",
        applicationUrl: initialData.applicationUrl || "",
        dateApplied: initialData.dateApplied
          ? new Date(initialData.dateApplied).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        resumeVersion: "",
        coverLetter: "",
        coverLetterType: "none",
      });
    }
  }, [initialData]);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${base_url}/resume/get-resume`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.Resume) {
        // The API returns the latest resume as "Resume" (capital R)
        setResumes([response.data.Resume]);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      // If no resume found, that's okay - user can still add application without tracking resume
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        resumeVersion: formData.resumeVersion || null,
        coverLetter: formData.coverLetter || "",
        coverLetterType: formData.coverLetterType || "none",
      };

      const response = await axios.post(`${base_url}/applications`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Application added successfully!");
        if (onSuccess) onSuccess();
        // Reset form
        setFormData({
          jobTitle: "",
          companyName: "",
          location: "",
          jobPlatform: "LinkedIn",
          applicationUrl: "",
          dateApplied: new Date().toISOString().split("T")[0],
          resumeVersion: "",
          coverLetter: "",
          coverLetterType: "none",
        });
      }
    } catch (error) {
      console.error("Error creating application:", error);
      toast.error(
        error.response?.data?.message || "Failed to create application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Application</DialogTitle>
          <DialogDescription className="text-gray-400">
            Track a job application you've submitted externally
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jobTitle" className="text-gray-300">
                  Job Title *
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName" className="text-gray-300">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-gray-300">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                  placeholder="City, State/Country"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jobPlatform" className="text-gray-300">
                  Platform *
                </Label>
                <Select
                  value={formData.jobPlatform}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobPlatform: value })
                  }
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indeed">Indeed</SelectItem>
                    <SelectItem value="Glassdoor">Glassdoor</SelectItem>
                    <SelectItem value="Company Website">Company Website</SelectItem>
                    <SelectItem value="Monster">Monster</SelectItem>
                    <SelectItem value="ZipRecruiter">ZipRecruiter</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="applicationUrl" className="text-gray-300">
                Application URL
              </Label>
              <Input
                id="applicationUrl"
                type="url"
                value={formData.applicationUrl}
                onChange={(e) =>
                  setFormData({ ...formData, applicationUrl: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateApplied" className="text-gray-300">
                Date Applied
              </Label>
              <Input
                id="dateApplied"
                type="date"
                value={formData.dateApplied}
                onChange={(e) =>
                  setFormData({ ...formData, dateApplied: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            {resumes.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="resumeVersion" className="text-gray-300">
                  Resume Version (Optional)
                </Label>
                <Select
                  value={formData.resumeVersion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, resumeVersion: value })
                  }
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Select resume version" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="">None</SelectItem>
                    {resumes.map((resume) => (
                      <SelectItem
                        key={resume._id}
                        value={resume._id}
                      >
                        {resume.personal_information?.full_name || "Resume"} -{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="coverLetter" className="text-gray-300">
                Cover Letter (Optional)
              </Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700 text-white"
                rows={4}
                placeholder="Paste your cover letter text here..."
              />
              {formData.coverLetter && (
                <Select
                  value={formData.coverLetterType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, coverLetterType: value })
                  }
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="ai_generated">AI Generated</SelectItem>
                    <SelectItem value="uploaded">Uploaded</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplicationDialog;
