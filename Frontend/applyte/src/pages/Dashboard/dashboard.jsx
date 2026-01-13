import { SidebarProvider, useSidebar } from "@/Context/ActiveDashboardComp";
import Sidebar from "./Sidebar/sidebar";
import Profile from "./Profile/Profile";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MyResume from "./Resume/MyResume";
import JobSearch from "./JobSearch/jobsearch";
import Applications from "./Applications/Applications";

const Dashboard = () => {
  const { activeComponent } = useSidebar();
  
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <DashboardOverview />;
      case "resume":
        return <MyResume />;
      case "job-search":
        return <JobSearch />;
      case "settings":
        return <Profile />;
      case "applications":
        return <Applications />;
      case "cover-letters":
        return (
          <div className="flex-1 overflow-y-auto bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-white mb-4">Cover Letters</h1>
              <p className="text-gray-400">Create and manage your cover letters here.</p>
            </div>
          </div>
        );
      case "interview-prep":
        return (
          <div className="flex-1 overflow-y-auto bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-white mb-4">Interview Prep</h1>
              <p className="text-gray-400">Prepare for your interviews with AI-powered assistance.</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      {renderComponent()}
    </div>
  );
};

export default Dashboard;
