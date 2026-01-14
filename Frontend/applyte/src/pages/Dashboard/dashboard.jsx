import { SidebarProvider, useSidebar } from "@/Context/ActiveDashboardComp";
import Sidebar from "./Sidebar/sidebar";
import Profile from "./Profile/Profile";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import MyResume from "./Resume/MyResume";
import JobSearch from "./JobSearch/jobsearch";
import Applications from "./Applications/Applications";
import InterviewPrep from "./InterviewPrep/InterviewPrep";
import SkillGapAnalysis from "./SkillGapAnalysis/SkillGapAnalysis";

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
      case "skill-gap-analysis":
        return <SkillGapAnalysis />;
      case "interview-prep":
        return <InterviewPrep />;
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
