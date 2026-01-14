import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ApplicationAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const {
    totalApplications,
    interviews,
    offers,
    rejected,
    rejectionRate,
    statusDistribution,
  } = analytics;

  const interviewRate =
    totalApplications > 0
      ? ((interviews / totalApplications) * 100).toFixed(1)
      : 0;
  const offerRate =
    totalApplications > 0 ? ((offers / totalApplications) * 100).toFixed(1) : 0;

  const stats = [
    {
      label: "Total Applications",
      value: totalApplications,
      icon: Briefcase,
    },
    {
      label: "Interviews",
      value: interviews,
      icon: TrendingUp,
    },
    {
      label: "Offers",
      value: offers,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-red-950 to-black border-red-900/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-red-500" />
          Application Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-yellow-600/50 bg-yellow-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-white/90 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Interview Rate</span>
              <span className="text-sm font-semibold text-white">
                {interviewRate}%
              </span>
            </div>
            <Progress
              value={parseFloat(interviewRate)}
              className="h-2 bg-black [&>div]:bg-yellow-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Offer Rate</span>
              <span className="text-sm font-semibold text-white">
                {offerRate}%
              </span>
            </div>
            <Progress
              value={parseFloat(offerRate)}
              className="h-2 bg-black [&>div]:bg-yellow-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Rejection Rate</span>
              <span className="text-sm font-semibold text-white">
                {rejectionRate}%
              </span>
            </div>
            <Progress
              value={rejectionRate}
              className="h-2 bg-black [&>div]:bg-yellow-500"
            />
          </div>
        </div>

        {analytics.bestResume && (
          <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
            <p className="text-sm text-gray-400 mb-1">Best Performing Resume</p>
            <p className="text-sm text-white font-medium">
              Resume ID: {analytics.bestResume.substring(0, 8)}...
            </p>
          </div>
        )}

        {analytics.bestCoverLetter && (
          <div className="mt-2 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
            <p className="text-sm text-gray-400 mb-1">Best Performing Cover Letter</p>
            <p className="text-sm text-white font-medium capitalize">
              {analytics.bestCoverLetter.replace("_", " ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationAnalytics;
