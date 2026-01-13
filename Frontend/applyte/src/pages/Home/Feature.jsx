import React from "react";
import { 
  Upload, Search, FileText, Zap, RefreshCw, Bot, CheckCircle, ArrowRight, Sparkles
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Smart Resume Parsing",
    description: "Upload your resume and let our AI automatically extract skills, experience, and education details with precision."
  },
  {
    icon: Search,
    title: "AI Job Matching",
    description: "Get personalized job recommendations from multiple platforms based on your skills and preferences."
  },
  {
    icon: FileText,
    title: "AI Cover Letter Generator",
    description: "Generate professional, tailored cover letters for each job application in seconds."
  },
  {
    icon: Zap,
    title: "Resume Optimization",
    description: "AI-powered resume analysis and enhancement to make your resume stand out to employers."
  },
  {
    icon: RefreshCw,
    title: "Resume Tailoring",
    description: "Automatically customize your resume for each specific job description to increase match rate."
  },
  {
    icon: Sparkles,
    title: "ATS Optimization",
    description: "Ensure your resume passes through Applicant Tracking Systems with optimized formatting and keywords."
  }
];

const Features = () => {
  return (
    <div className="relative py-24 bg-black text-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.3),transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">AI-Powered Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Streamline Your
            <span className="block bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
              Job Search Process
            </span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            From resume optimization to personalized job matching and cover letter generation — 
            we handle the heavy lifting so you can focus on what matters.
          </p>
        </div>

        {/* Feature Grid - Responsive Card Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-5 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.1)] transition-all duration-500 overflow-hidden"
              >
                {/* Soft gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-gray-700/10 via-gray-600/5 to-transparent"></div>

                {/* Icon Section */}
                <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
                  <div className="p-2 sm:p-3 bg-neutral-800 rounded-xl border border-neutral-700 group-hover:border-neutral-500 transition duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-300 transform group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Title & Description */}
                <h3 className="text-lg sm:text-xl lg:text-xl font-semibold text-gray-200 mb-3 sm:mb-3 lg:mb-4 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm lg:text-sm leading-relaxed sm:leading-relaxed lg:leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <button className="inline-flex items-center gap-3 bg-white text-black font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] text-sm sm:text-base">
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;