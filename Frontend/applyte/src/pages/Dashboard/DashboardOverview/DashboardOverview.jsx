import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Mail, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  Upload,
  Search,
  FileCheck,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/Context/ActiveDashboardComp";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { Store } from "@/store/store";

const DashboardOverview = () => {
  const { setActiveComponent } = useSidebar();
  const { user } = Store();
  const [stats, setStats] = useState({
    resumes: 0,
    coverLetters: 0,
    applications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${base_url}/user/get-stats`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setStats({
            resumes: response.data.ResumeCount || 0,
            coverLetters: response.data.CoverLetterCount || 0,
            applications: response.data.ApplicationCount || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        toast.error("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Resumes",
      value: stats.resumes,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      action: () => setActiveComponent("resume"),
    },
    {
      title: "Cover Letters",
      value: stats.coverLetters,
      icon: Mail,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      action: () => setActiveComponent("cover-letters"),
    },
    {
      title: "Applications",
      value: stats.applications,
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      action: () => setActiveComponent("applications"),
    },
  ];

  const quickActions = [
    {
      title: "Upload Resume",
      description: "Upload and analyze your resume",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      action: () => setActiveComponent("resume"),
    },
    {
      title: "Search Jobs",
      description: "Find jobs matching your resume",
      icon: Search,
      color: "from-purple-500 to-pink-500",
      action: () => setActiveComponent("job-search"),
    },
    {
      title: "Create Cover Letter",
      description: "Generate a personalized cover letter",
      icon: FileCheck,
      color: "from-green-500 to-emerald-500",
      action: () => setActiveComponent("cover-letters"),
    },
    {
      title: "Interview Prep",
      description: "Prepare for your next interview",
      icon: MessageSquare,
      color: "from-orange-500 to-red-500",
      action: () => setActiveComponent("interview-prep"),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.username ? `, ${user.username}` : ""}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your job search today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`bg-neutral-900 border ${stat.borderColor} hover:border-opacity-50 transition-all duration-300 cursor-pointer group`}
                onClick={stat.action}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} ${stat.bgColor}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      <span className="text-gray-400">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                        View all
                        <ArrowRight className="w-3 h-3" />
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className={`bg-neutral-900 border border-neutral-800 hover:border-opacity-50 transition-all duration-300 cursor-pointer group hover:bg-neutral-800/50`}
                  onClick={action.action}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-base text-white group-hover:text-gray-200 transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity / Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.resumes === 0 && stats.coverLetters === 0 && stats.applications === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No activity yet</p>
                    <p className="text-sm text-gray-500">
                      Start by uploading your resume or searching for jobs
                    </p>
                    <Button
                      onClick={() => setActiveComponent("resume")}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.resumes > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {stats.resumes} {stats.resumes === 1 ? "resume" : "resumes"} uploaded
                          </p>
                          <p className="text-xs text-gray-400">Manage your resumes</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveComponent("resume")}
                          className="text-gray-400 hover:text-white"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {stats.applications > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Briefcase className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {stats.applications} {stats.applications === 1 ? "application" : "applications"} tracked
                          </p>
                          <p className="text-xs text-gray-400">View your applications</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveComponent("applications")}
                          className="text-gray-400 hover:text-white"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips & Insights */}
          <Card className="bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tips & Insights
              </CardTitle>
              <CardDescription className="text-gray-400">
                Helpful tips to improve your job search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Optimize Your Resume
                  </h4>
                  <p className="text-xs text-gray-400">
                    Use our AI-powered resume analyzer to improve your resume and increase your chances of getting noticed.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Personalized Cover Letters
                  </h4>
                  <p className="text-xs text-gray-400">
                    Create tailored cover letters for each job application to stand out from other candidates.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Smart Job Matching
                  </h4>
                  <p className="text-xs text-gray-400">
                    Let our AI find the best job matches based on your resume and preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
