import React, { useEffect, useRef, useState } from "react";
import { 
  Rocket, 
  BarChart3,
  FileText, 
  Search, 
  Briefcase,
  Mail,
  MessageSquare,
  User, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/Context/ActiveDashboardComp";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { Store } from "@/store/store";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "resume", label: "My Resume", icon: FileText },
  { id: "job-search", label: "Job Search", icon: Search },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "cover-letters", label: "Cover Letters", icon: Mail },
  { id: "interview-prep", label: "Interview Prep", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const { activeComponent, setActiveComponent, isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { setUser } = Store();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const res = await axios.get(`${base_url}/user/auth/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(undefined);
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (e) {
      console.log("Error in logout: ", e);
      toast.error(e.response?.data?.message || "Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleItemClick = (itemId) => {
    setActiveComponent(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (isCollapsed) {
      toggleSidebar();
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
        isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setIsMobileOpen(false)}
    />
  );

  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay />
      
      {/* Mobile Menu Button - Only show when sidebar is closed on mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={cn(
          "fixed top-4 left-4 z-40 p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-gray-400 hover:text-white hover:bg-neutral-800 transition-all duration-300 md:hidden",
          isMobileOpen && "hidden"
        )}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 h-screen fixed top-0 z-50",
          "transform transition-transform duration-300 ease-in-out",
          // Desktop width
          isCollapsed ? "w-20" : "w-64",
          // Mobile full width behavior
          "md:translate-x-0 md:sticky",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <button
            onClick={handleLogoClick}
            className={cn(
              "flex items-center gap-3 transition-all duration-300 group",
              isCollapsed && "justify-center w-full cursor-pointer",
              isCollapsed && "hover:bg-neutral-800/50 rounded-lg p-1"
            )}
          >
            <div className="p-2 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-lg border border-neutral-600">
              <Rocket className="w-5 h-5 text-gray-200" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                APPLYTE
              </span>
            )}
            {/* Expand tooltip when collapsed on desktop */}
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                <div className="bg-neutral-800 text-white text-sm py-2 px-3 rounded-md shadow-lg border border-neutral-700 whitespace-nowrap">
                  Expand Sidebar
                </div>
              </div>
            )}
          </button>
          
          {/* Close button for mobile, Collapse button for desktop */}
          <div className="flex items-center gap-2">
            {/* Mobile Close Button */}
            {isMobileOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8 p-0 hover:bg-neutral-800 text-gray-400 hover:text-white transition-all duration-300 md:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            
            {/* Desktop Collapse Button - Only show when not collapsed */}
            {!isCollapsed && !isMobileOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSidebar}
                className="h-8 w-8 p-0 hover:bg-neutral-800 text-gray-400 hover:text-white transition-all duration-300 hidden md:flex"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeComponent === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    "hover:bg-neutral-800 hover:text-white hover:border-neutral-700",
                    "border border-transparent",
                    isActive 
                      ? "bg-neutral-800 text-white border-neutral-700 shadow-lg" 
                      : "text-gray-400"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200 shrink-0",
                    isActive 
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                      : "bg-neutral-800 text-gray-400 group-hover:bg-neutral-700 group-hover:text-white"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="transition-all duration-200 text-left">
                      {item.label}
                    </span>
                  )}
                  {/* Tooltip for collapsed state on desktop only */}
                  {isCollapsed && !isMobileOpen && (
                    <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                      <div className="bg-neutral-800 text-white text-sm py-2 px-3 rounded-md shadow-lg border border-neutral-700 whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with Logout - Proper alignment for all states */}
        <div className={cn(
          "p-4 border-t border-neutral-800",
          isCollapsed && !isMobileOpen && "flex justify-center"
        )}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              "hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20",
              "text-gray-400 border border-transparent disabled:opacity-60 disabled:cursor-not-allowed",
              // Different widths based on state
              isCollapsed && !isMobileOpen ? "w-12 justify-center px-2 py-2" : "w-full px-3 py-3"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg bg-neutral-800 text-gray-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-200",
              isCollapsed && !isMobileOpen && "mx-auto"
            )}>
              {loggingOut ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="transition-all duration-200">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
            {/* Tooltip for collapsed logout on desktop only */}
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-2 z-50 hidden group-hover:block">
                <div className="bg-neutral-800 text-white text-sm py-2 px-3 rounded-md shadow-lg border border-neutral-700 whitespace-nowrap">
                  Logout
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;