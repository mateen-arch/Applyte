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
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Interviews",
      value: interviews,
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Offers",
      value: offers,
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
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
                className={`p-4 rounded-lg border border-neutral-700/50 ${stat.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Interview Rate</span>
              <span className="text-sm font-semibold text-yellow-400">
                {interviewRate}%
              </span>
            </div>
            <Progress
              value={parseFloat(interviewRate)}
              className="h-2 bg-neutral-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Offer Rate</span>
              <span className="text-sm font-semibold text-green-400">
                {offerRate}%
              </span>
            </div>
            <Progress
              value={parseFloat(offerRate)}
              className="h-2 bg-neutral-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Rejection Rate</span>
              <span className="text-sm font-semibold text-red-400">
                {rejectionRate}%
              </span>
            </div>
            <Progress
              value={rejectionRate}
              className="h-2 bg-neutral-800"
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
