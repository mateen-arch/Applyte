import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { Store } from "@/store/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Upload,
  Save,
  Trash2,
  User,
  Mail,
  Camera,
  FileText,
  FileEdit,
  Briefcase,
  Download,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Profile = () => {
  const { user, setUser } = Store();
  const [userInfo, setUserInfo] = useState(() => ({
    username: user?.username || "",
    email: user?.email || "",
    image: user?.image || "",
  }));

  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState({
    resumes: 0,
    coverLetters: 0,
    applications: 0,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`${base_url}/user/get-stats`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setStats({
            resumes: response.data.ResumeCount || 0,
            coverLetters: response.data.CoverLetterCount || 0,
            applications: response.data.ApplicationCount || 0,
          });
        } else {
          console.log("Failed to fetch stats:", response.data.message);
        }
      } catch (err) {
        console.log("Failed to fetch the user stats:", err);
        toast.error("Failed to load statistics");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
        image: user.image || "",
      });
      setImagePreview(user.image || "");
    }
  }, [user]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `${base_url}/user/auth/update-image`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadProgress(100);

      if (res.data.success) {
        setTimeout(() => {
          toast.success("Profile image updated successfully!");
          setUserInfo((prev) => ({
            ...prev,
            image: res.data.imageUrl || imagePreview,
          }));
          setUser((prev) => ({
            ...prev,
            image: res.data.imageUrl || imagePreview,
          }));
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setUploadProgress(0);
        }, 300);
      }
    } catch (error) {
      console.log("Error uploading image: ", error);
      toast.error(
        error.response?.data?.message || "Failed to upload profile image."
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateInfo = async () => {
  // Trim inputs
  const trimmedUsername = userInfo.username.trim();
  const trimmedEmail = userInfo.email.trim();

  // Backend allows updating one field at a time
  // So we don't need to require both fields

  // Check if nothing changed
  const usernameUnchanged = trimmedUsername === user.username;
  const emailUnchanged = trimmedEmail === user.email;
  
  if (usernameUnchanged && emailUnchanged) {
    toast.error("No changes to update.");
    return;
  }

  // Validate email if provided and different
  if (trimmedEmail && !emailUnchanged) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  }

  // Validate username if provided and different
  if (trimmedUsername && !usernameUnchanged) {
    if (trimmedUsername.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
  }

  // Prepare payload - send only what's provided
  const updatePayload = {};
  
  if (trimmedUsername && !usernameUnchanged) {
    updatePayload.username = trimmedUsername;
  }
  
  if (trimmedEmail && !emailUnchanged) {
    updatePayload.email = trimmedEmail;
  }

  // If payload is empty after checks, return
  if (Object.keys(updatePayload).length === 0) {
    toast.error("No changes to update.");
    return;
  }

  try {
    setIsUpdating(true);
    
    const res = await axios.put(
      `${base_url}/user/auth/update-info`,
      updatePayload,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message || "Profile updated!");
      
      // Update state with new data
      setUserInfo(prev => ({
        ...prev,
        username: res.data.User.username || prev.username,
        email: res.data.User.email || prev.email,
      }));
      
      setUser(prev => ({
        ...prev,
        username: res.data.User.username || prev.username,
        email: res.data.User.email || prev.email,
        image: res.data.User.image || prev.image,
      }));
    }
  } catch (error) {
    console.log("Update error:", error);
    
    // Specific error handling
    if (error.response?.status === 400) {
      if (error.response?.data?.message === "Email already exists!") {
        toast.error("This email is already registered. Please use a different one.");
      } else {
        toast.error(error.response.data.message || "Update failed.");
      }
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  } finally {
    setIsUpdating(false);
  }
};

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(`${base_url}/user/auth/delete-account`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Account deleted successfully. Redirecting...");
        setUser(null);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.log("Error deleting account: ", error);
      toast.error(error.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white/10 shadow-2xl">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-3xl font-bold">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {user.username}
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <Badge className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Active User
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Image Upload Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Camera className="w-5 h-5 text-blue-400" />
                  Profile Picture
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a new profile image (Max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white/10 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50">
                      {imagePreview ? (
                        <AvatarImage
                          src={imagePreview}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-4xl font-bold">
                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-3">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-gray-900/50 border-gray-700 text-white file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                      />

                      {uploadProgress > 0 && (
                        <div className="space-y-2">
                          <Progress
                            value={uploadProgress}
                            className="h-2 bg-gray-800"
                          />
                          <p className="text-sm text-gray-400 text-right">
                            {uploadProgress}% uploaded
                          </p>
                        </div>
                      )}

                      <Button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={
                          isUploading || !fileInputRef.current?.files?.length
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-green-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={userInfo.username}
                      onChange={(e) =>
                        setUserInfo((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="bg-gray-900/50 border-gray-700 text-white"
                      placeholder="Your username"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="bg-gray-900/50 border-gray-700 text-white"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={handleUpdateInfo}
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Danger Zone */}
          <div className="space-y-8">
            {/* Documents Stats Card */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Documents Generated
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your document creation stats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {stats.resumes}
                    </p>
                    <p className="text-sm text-gray-400">Resumes</p>
                  </div>

                  <div className="text-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <FileEdit className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {stats.coverLetters}
                    </p>
                    <p className="text-sm text-gray-400">Cover Letters</p>
                  </div>

                  <div className="text-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors col-span-2">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {stats.applications}
                    </p>
                    <p className="text-sm text-gray-400">Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone Card */}
            <Card className="bg-gradient-to-br from-red-900/20 to-red-950/10 border-red-900/30 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-300/70">
                  Permanent actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-red-200/70">
                    Deleting your account will permanently remove all your
                    documents and data.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-red-900">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-400">
                          Delete Account Permanently?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          This will permanently delete:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>All resumes ({stats.resumes})</li>
                            <li>All cover letters ({stats.coverLetters})</li>
                            <li>All applications ({stats.applications})</li>
                            <li>Your profile and account</li>
                          </ul>
                          <p className="mt-4 text-red-300">
                            Please type{" "}
                            <strong className="text-white">DELETE</strong> to
                            confirm.
                          </p>
                          <Input
                            placeholder="Type DELETE to confirm"
                            className="mt-2 bg-gray-800 border-red-900 text-white"
                            id="delete-confirm"
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-700 hover:bg-gray-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
