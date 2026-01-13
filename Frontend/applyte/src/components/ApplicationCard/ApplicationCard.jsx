import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Globe,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Loader2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import ApplicationTimeline from "./ApplicationTimeline";
import FollowUpAssistant from "../FollowUpAssistant/FollowUpAssistant";

const ApplicationCard = ({ application, onUpdate, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    status: application.status,
    notes: application.notes || "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Not specified";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: {
        label: "Applied",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: Clock,
      },
      interview: {
        label: "Interview",
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        icon: Briefcase,
      },
      offer: {
        label: "Offer",
        className: "bg-green-500/10 text-green-400 border-green-500/30",
        icon: CheckCircle2,
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-500/10 text-red-400 border-red-500/30",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.applied;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${base_url}/applications/${application._id}`,
        editForm,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Application updated successfully!");
        setIsEditDialogOpen(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error(
        error.response?.data?.message || "Failed to update application"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${base_url}/applications/${application._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Application deleted successfully!");
        setIsDeleteDialogOpen(false);
        if (onDelete) onDelete();
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const daysSinceApplied = Math.floor(
    (new Date() - new Date(application.dateApplied)) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Card className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-white text-xl mb-3 line-clamp-2">
                {application.jobTitle}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                {application.companyName && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{application.companyName}</span>
                  </div>
                )}

                {application.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{application.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{application.jobPlatform}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Applied {formatDate(application.dateApplied)}</span>
                  {daysSinceApplied > 0 && (
                    <span className="text-gray-500">
                      ({daysSinceApplied} day{daysSinceApplied !== 1 ? "s" : ""} ago)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(application.status)}
                {application.resumeVersion && (
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
                    <FileText className="w-3 h-3 mr-1" />
                    Resume Tracked
                  </Badge>
                )}
                {application.coverLetter && application.coverLetter.trim() !== "" && (
                  <Badge variant="outline" className="border-pink-500/30 text-pink-400 bg-pink-500/10">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Cover Letter
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {application.applicationUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(application.applicationUrl, "_blank", "noopener,noreferrer")
                  }
                  className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Job
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFollowUpOpen(true)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Follow-Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {application.notes && application.notes.trim() !== "" && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                {application.notes}
              </p>
            </div>
          )}

          {application.timeline && application.timeline.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Timeline</h3>
              <ApplicationTimeline timeline={application.timeline} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Application</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the status and notes for this application
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-gray-300">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                className="bg-neutral-800 border-neutral-700 text-white"
                rows={4}
                placeholder="Add any notes about this application..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Application</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-Up Assistant Dialog */}
      <FollowUpAssistant
        isOpen={isFollowUpOpen}
        onClose={() => setIsFollowUpOpen(false)}
        application={application}
      />
    </>
  );
};

export default ApplicationCard;
