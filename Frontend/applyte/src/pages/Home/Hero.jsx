import { cn } from "@/lib/util";
import React from "react";
import { ArrowRight, Play, Shield, Clock, Star, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-black overflow-hidden">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 mb-8">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">Trusted by 10,000+ job seekers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="block text-white">
            Land Your Dream Job
          </span>
          <span className="block mt-2 bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
            With AI-Powered Precision
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
          Upload your resume, get personalized job matches, tailored cover letters,
          and optimized resumes—all powered by intelligent AI. Start free today.
        </p>

        {/* Buttons Container */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary Button */}
          <button className="group relative flex items-center justify-center bg-white hover:bg-gray-100 text-black font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-white/10">
            <span className="flex items-center">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>

          {/* Pro Upgrade Button */}
          <button
            onClick={() => navigate("/pricing")}
            className="group relative flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/50"
          >
            <Crown className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Upgrade to Pro
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <Shield className="w-4 h-4 mr-2" />
            14-day free trial
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            <Clock className="w-4 h-4 mr-2" />
            Set up in 2 minutes
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            <Star className="w-4 h-4 mr-2" />
            Cancel anytime
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-6">
            TRUSTED BY ENGINEERS AT
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
            <div className="text-gray-500 font-semibold">Google</div>
            <div className="text-gray-500 font-semibold">Microsoft</div>
            <div className="text-gray-500 font-semibold">Amazon</div>
            <div className="text-gray-500 font-semibold">Netflix</div>
            <div className="text-gray-500 font-semibold">Meta</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Hero;