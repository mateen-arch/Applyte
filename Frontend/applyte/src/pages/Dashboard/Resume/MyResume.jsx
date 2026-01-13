import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";

const MyResume = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    await uploadResume(file);
  };

  const uploadResume = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${base_url}/resume/analyze-resume`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        toast.success("Resume analyzed successfully!");
        setUploadProgress(100);
        // Fetch the resume data
        await fetchResume();
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload and analyze resume"
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${base_url}/resume/get-resume`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.Resume) {
        setResume(response.data.Resume);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      if (error.response?.status !== 400) {
        toast.error("Failed to fetch resume data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResume();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Resume</h1>
          <p className="text-gray-400">
            Upload and analyze your resume to get personalized job recommendations
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-neutral-900 border border-neutral-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Resume
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upload a PDF file of your resume (max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="space-y-4">
              <div
                onClick={handleFileSelect}
                className="border-2 border-dashed border-neutral-700 rounded-xl p-12 text-center cursor-pointer hover:border-neutral-600 transition-colors"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10 border border-blue-500/20">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF files only, maximum 5MB
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileSelect();
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-gray-400">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resume Data Section */}
        {isLoading ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <p className="text-gray-400">Loading resume data...</p>
              </div>
            </CardContent>
          </Card>
        ) : resume ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Resume Analyzed
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your resume has been successfully analyzed
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resume Details */}
                {resume.name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Name</h3>
                    <p className="text-white">{resume.name}</p>
                  </div>
                )}
                {resume.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                    <p className="text-white">{resume.email}</p>
                  </div>
                )}
                {resume.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Phone</h3>
                    <p className="text-white">{resume.phone}</p>
                  </div>
                )}
                {resume.skills && resume.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {resume.experience && resume.experience.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Experience</h3>
                    <div className="space-y-3">
                      {resume.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50"
                        >
                          <p className="text-white font-medium">{exp.title || exp.position}</p>
                          {exp.company && <p className="text-gray-400 text-sm">{exp.company}</p>}
                          {exp.duration && <p className="text-gray-500 text-xs">{exp.duration}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {resume.education && resume.education.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Education</h3>
                    <div className="space-y-3">
                      {resume.education.map((edu, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50"
                        >
                          <p className="text-white font-medium">{edu.degree || edu.school}</p>
                          {edu.school && edu.degree && (
                            <p className="text-gray-400 text-sm">{edu.school}</p>
                          )}
                          {edu.year && <p className="text-gray-500 text-xs">{edu.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400">No resume uploaded yet</p>
                <p className="text-sm text-gray-500">
                  Upload your resume to get started with job recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyResume;
