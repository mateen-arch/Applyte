import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  AlertCircle,
  Briefcase,
  Filter,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import ApplicationCard from "@/components/ApplicationCard/ApplicationCard";
import AddApplicationDialog from "@/components/AddApplicationDialog/AddApplicationDialog";
import ApplicationAnalytics from "@/components/ApplicationAnalytics/ApplicationAnalytics";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [analytics, setAnalytics] = useState(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${base_url}/applications`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setApplications(response.data.applications || []);
      } else {
        setError(response.data.message || "Failed to fetch applications");
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch applications";
      setError(errorMessage);
      setApplications([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${base_url}/applications/analytics/overview`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchAnalytics();
  }, []);

  const handleApplicationCreated = () => {
    fetchApplications();
    fetchAnalytics();
    setIsAddDialogOpen(false);
  };

  const handleApplicationUpdated = () => {
    fetchApplications();
    fetchAnalytics();
  };

  const handleApplicationDeleted = () => {
    fetchApplications();
    fetchAnalytics();
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const statusCounts = {
    all: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    interview: applications.filter((app) => app.status === "interview").length,
    offer: applications.filter((app) => app.status === "offer").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
            <p className="text-gray-400">
              Track and manage all your job applications
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="mb-8">
            <ApplicationAnalytics analytics={analytics} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filter by status:</span>
          {["all", "applied", "interview", "offer", "rejected"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={
                filterStatus === status
                  ? "bg-yellow-500 text-black font-medium hover:bg-yellow-600 border border-yellow-500"
                  : "bg-black text-white border border-neutral-800 hover:bg-neutral-900"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {statusCounts[status] > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-neutral-700 text-white"
                >
                  {statusCounts[status]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">
                    Loading applications...
                  </p>
                  <p className="text-sm text-gray-500">
                    Fetching your application data
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
                  <p className="text-gray-300 font-medium mb-1">{error}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Please try again later
                  </p>
                  <Button
                    onClick={fetchApplications}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : filteredApplications.length === 0 ? (
          /* Empty State */
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Briefcase className="w-12 h-12 text-gray-600" />
                <div className="text-center">
                  <p className="text-gray-300 font-medium mb-1">
                    {filterStatus === "all"
                      ? "No applications yet"
                      : `No ${filterStatus} applications`}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {filterStatus === "all"
                      ? "Start tracking your job applications by adding your first one"
                      : `You don't have any applications with status "${filterStatus}"`}
                  </p>
                  {filterStatus === "all" && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Application
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Applications List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {filteredApplications.length}{" "}
                {filteredApplications.length === 1 ? "Application" : "Applications"}
              </h2>
            </div>
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onUpdate={handleApplicationUpdated}
                  onDelete={handleApplicationDeleted}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Application Dialog */}
        <AddApplicationDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleApplicationCreated}
        />
      </div>
    </div>
  );
};

export default Applications;
