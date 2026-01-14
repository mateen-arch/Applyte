import React, { useState } from "react";
import {
  Menu,
  X,
  Rocket,
  Home,
  Zap,
  DollarSign,
  MessageSquare,
  User,
  ChevronDown,
  BookOpen,
  Bolt,
  Layers,
  LogOut,
} from "lucide-react";
import Auth from "../Auth/Auth";
import { Store } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const navLinks = [
  { name: "Home", icon: Home, path: "#" },
  { name: "Features", icon: Zap, path: "#features" },
  { name: "Pricing", icon: DollarSign, path: "#pricing" },
  { name: "Testimonial", icon: MessageSquare, path: "#testimonials" },
];

const Navbar = () => {
  const { user, setUser } = Store();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const res = await axios.get(`${base_url}/user/auth/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(undefined);
        toast.success(res.data.message);
      }
    } catch (e) {
      console.log("Error in logout: ", e);
      toast.error(e.response?.data?.message || "Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-neutral-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl border border-neutral-700/50 shadow-lg">
              <Rocket className="w-6 h-6 text-gray-200" />
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
              APPLYTE
            </p>
          </div>

          {/* Desktop Nav Links - Only visible on md and above */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 
                           text-sm font-medium px-4 py-2 rounded-xl border border-transparent 
                           hover:bg-neutral-800/50 hover:border-neutral-700/30 hover:shadow-lg"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* User Menu / Auth */}
          <div className="flex gap-5">
            <div className="flex items-center justify-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto p-2 hover:bg-neutral-800/50 rounded-xl border border-transparent hover:border-neutral-700/30"
                      disabled={loggingOut}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            {user.image && user.image.trim() !== "" ? (
                              <AvatarImage
                                src={user.image}
                                alt="Profile image"
                              />
                            ) : null}
                            <AvatarFallback className="bg-neutral-700 text-white text-sm">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -end-1.5 -top-1.5">
                            <span className="sr-only">Verified</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                className="fill-background"
                                d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                              />
                              <path
                                className="fill-primary"
                                d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                              />
                              <path
                                className="fill-background"
                                d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                              />
                            </svg>
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-gray-400 hidden md:block"
                        />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-neutral-900 border-neutral-800 text-white"
                    align="end"
                  >
                    <DropdownMenuLabel className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-white">
                        {user.username || "User"}
                      </span>
                      <span className="truncate text-xs font-normal text-gray-400">
                        {user.email || "user@example.com"}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-neutral-700" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-gray-300 hover:text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer">
                        <Bolt size={16} className="mr-2 text-gray-400" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-neutral-700" />
                    <DropdownMenuItem
                      className="text-gray-300 hover:text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <LogOut size={16} className="mr-2 text-gray-400" />
                      )}
                      <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:block">
                  <Auth />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl border border-neutral-700/50 bg-neutral-900/50 
                       text-gray-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-300"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-neutral-800/80 mt-2">
            <div className="px-3 pt-3 pb-4 space-y-2 bg-black/95 backdrop-blur-lg rounded-xl border border-neutral-800/80 shadow-2xl">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg 
                             text-sm font-medium transition-all duration-300 hover:bg-neutral-800/50 
                             border border-transparent hover:border-neutral-700/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </a>
                );
              })}
              {user && (
                <div className="pt-2 border-t border-neutral-700">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white px-4 py-3 rounded-lg 
                             text-sm font-medium transition-all duration-300 hover:bg-neutral-800/50 
                             border border-transparent hover:border-neutral-700/30 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <LogOut size={16} className="text-gray-400" />
                    )}
                    <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
              {!user && (
                <div className="pt-2">
                  <Auth />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;