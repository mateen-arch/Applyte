import React from "react";
import { Clock, CheckCircle2, FileText, XCircle } from "lucide-react";

const ApplicationTimeline = ({ timeline }) => {
  const getTimelineIcon = (type) => {
    switch (type) {
      case "applied":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "status_updated":
        return <CheckCircle2 className="w-4 h-4 text-yellow-400" />;
      case "note_added":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "outcome_reached":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-3">
      {timeline.map((event, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {getTimelineIcon(event.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300">{event.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(event.date)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationTimeline;
