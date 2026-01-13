import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Rocket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { useNavigate } from "react-router";
import { Store } from "@/store/store";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignin, setIsSignin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = Store();

  const [signinData, setSigninData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSigninChange = (field, value) => {
    setSigninData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (isSignin) {
      if (!signinData.name || !signinData.email || !signinData.password) {
        toast.error("Please fill in all fields");
        return;
      }
    } else {
      if (!loginData.email || !loginData.password) {
        toast.error("Please fill in all fields");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignin) {
        // Signup logic
        const res = await axios.post(
          `${base_url}/user/auth/signup`,
          signinData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          navigate(`/verify_email/${res.data.email}`);
          toast.success(res.data.message);
          setSigninData({
            name: "",
            email: "",
            password: "",
          });
        }
      } else {
        // Login logic
        const res = await axios.post(`${base_url}/user/auth/login`, loginData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (res.data.success) {
          if (res.data.User.isVerified) {
            navigate("/");
            toast.success("Welcome back!");
          } else {
            navigate(`/verify_email/${res.data.User.email}`);
            toast.success(res.data.message);
          }
          setUser(res.data.User);
          setLoginData({
            email: "",
            password: "",
          });
        }
      }
    } catch (e) {
      console.log(`Error in ${isSignin ? "Signup" : "Login"}: `, e);

      // Show specific error messages from backend if available
      if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error(
          `Something went wrong during ${isSignin ? "sign up" : "login"}!`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSigninData({
      name: "",
      email: "",
      password: "",
    });
    setLoginData({
      email: "",
      password: "",
    });
    setIsLoading(false);
  };

  const handleToggleMode = (mode) => {
    if (isLoading) return; // Prevent switching while loading
    setIsSignin(mode);
    resetForm();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-full flex items-center justify-center space-x-2 text-white 
                                       bg-gradient-to-r from-neutral-800 to-neutral-900 border border-neutral-700/50 
                                       hover:from-neutral-700 hover:to-neutral-800 transition-all duration-300 
                                       px-4 py-3 rounded-lg mt-3 font-medium"
        >
          <User className="w-4 h-4" />
          <span>Get Started</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700">
              <Rocket className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              APPLYTE
            </span>
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl text-white text-center">
              {isSignin ? "Create your account" : "Welcome back"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              {isSignin
                ? "Sign up to start your job search journey"
                : "Enter your credentials to access your account"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Toggle between Signin and Login */}
        <div className="flex bg-neutral-800 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
              isSignin
                ? "bg-white text-black shadow-lg"
                : "text-gray-400 hover:text-white disabled:hover:text-gray-400"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
              !isSignin
                ? "bg-white text-black shadow-lg"
                : "text-gray-400 hover:text-white disabled:hover:text-gray-400"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Sign In
          </button>
        </div>

        {isSignin ? (
          // Sign Up Form
          <div className="space-y-5">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="signin-name"
                  className="text-gray-300 text-sm font-medium"
                >
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signin-name"
                    placeholder="Matt Welsh"
                    type="text"
                    value={signinData.name}
                    onChange={(e) => handleSigninChange("name", e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white pl-10 focus:border-neutral-500 placeholder:text-gray-500 disabled:opacity-50"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="signin-email"
                  className="text-gray-300 text-sm font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signin-email"
                    placeholder="hi@yourcompany.com"
                    type="email"
                    value={signinData.email}
                    onChange={(e) =>
                      handleSigninChange("email", e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-700 text-white pl-10 focus:border-neutral-500 placeholder:text-gray-500 disabled:opacity-50"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="signin-password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="signin-password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={signinData.password}
                    onChange={(e) =>
                      handleSigninChange("password", e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-700 text-white pl-10 pr-10 focus:border-neutral-500 placeholder:text-gray-500 disabled:opacity-50"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-gray-500 text-center text-xs">
              By signing up you agree to our{" "}
              <a className="text-gray-300 hover:text-white underline" href="#">
                Terms
              </a>
            </p>
          </div>
        ) : (
          // Login Form
          <div className="space-y-5">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-email"
                  className="text-gray-300 text-sm font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-email"
                    placeholder="hi@yourcompany.com"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white pl-10 focus:border-neutral-500 placeholder:text-gray-500 disabled:opacity-50"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="login-password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      handleLoginChange("password", e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-700 text-white pl-10 pr-10 focus:border-neutral-500 placeholder:text-gray-500 disabled:opacity-50"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  className="border-neutral-700 data-[state=checked]:bg-white data-[state=checked]:text-black disabled:opacity-50"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-gray-400 text-sm font-normal"
                >
                  Remember me
                </Label>
              </div>
              <a
                className="text-gray-400 hover:text-white text-sm underline disabled:opacity-50 disabled:hover:text-gray-400"
                href="#"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="button"
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Auth;
