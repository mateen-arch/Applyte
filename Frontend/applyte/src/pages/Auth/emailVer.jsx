import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Rocket, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";
import { Store } from "@/store/store";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { setUser } = Store();
  const { email: user_email } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedArray = pastedData.split("");

    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const nextInput = document.getElementById(`otp-${focusIndex}`);
    if (nextInput) nextInput.focus();
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const otpString = otp.join("");

      const res = await axios.post(
        `${base_url}/user/auth/verify`,
        { otp: otpString },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsVerified(true);
        toast.success(res.data.message);
        setUser(res.data.User);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      console.log("Verification error:", e);
      if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const res = await axios.get(
        `${base_url}/user/auth/resend_otp/${user_email}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setOtp(["", "", "", "", "", ""]);

        // Start cooldown timer (60 seconds)
        setResendCooldown(60);
        const cooldownInterval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(cooldownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Focus first input
        const firstInput = document.getElementById("otp-0");
        if (firstInput) firstInput.focus();
      }
    } catch (e) {
      console.log("Error in resend OTP: ", e);
      if (e.response?.data?.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isAnyLoading = isVerifying || isResending;
  const isResendDisabled = isResending || resendCooldown > 0;

  if (isVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your email has been successfully verified. Redirecting to
              dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700">
              <Rocket className="w-5 h-5 text-gray-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              APPLYTE
            </span>
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-white text-2xl">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-400">
            We've sent a 6-digit verification code to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-white text-lg font-semibold bg-neutral-800 border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isAnyLoading}
                />
              ))}
            </div>

            <p className="text-gray-500 text-sm text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={!isOtpComplete || isAnyLoading}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2.5"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className="text-gray-400 hover:text-white text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Resending...
                </div>
              ) : resendCooldown > 0 ? (
                `Resend OTP in ${resendCooldown}s`
              ) : (
                "Didn't receive code? Resend OTP"
              )}
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              disabled={isAnyLoading}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
