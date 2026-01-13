import { SidebarProvider, useSidebar } from "@/Context/ActiveDashboardComp";
import Sidebar from "./Sidebar/sidebar";
import Profile from "./Profile/Profile";

const Dashboard = () => {
  const { activeComponent } = useSidebar();
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      {activeComponent == "settings" ? <Profile /> : <></>}
    </div>
  );
};

export default Dashboard;
