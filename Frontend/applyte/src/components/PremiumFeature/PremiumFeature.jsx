import React, { useState } from "react";
import { Crown, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PremiumFeature = ({ 
  children, 
  isPremium = false, 
  featureName = "Premium Feature",
  description = "Upgrade to Pro to unlock this feature",
  className = ""
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleGoPro = () => {
    navigate("/pricing");
  };

  if (isPremium) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred Content */}
      <div 
        className="relative transition-all duration-300"
        style={{
          filter: "blur(8px)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.5
        }}
      >
        {children}
      </div>

      {/* Premium Overlay */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 transition-all duration-300 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleGoPro}
        style={{
          background: isHovered 
            ? "linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)"
            : "rgba(0, 0, 0, 0.6)"
        }}
      >
        {/* Animated Crown Icon */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Crown className="w-8 h-8 text-white animate-bounce" />
          </div>
          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>

        {/* Lock Icon */}
        <div className="mb-3">
          <Lock className="w-6 h-6 text-gray-300" />
        </div>

        {/* Feature Name */}
        <h3 className="text-xl font-bold text-white mb-2 text-center px-4">
          {featureName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-6 text-center px-4 max-w-sm">
          {description}
        </p>

        {/* Go Pro Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleGoPro();
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6 py-2.5 shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <Crown className="w-4 h-4 mr-2" />
          Go Pro
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Premium Badge */}
        <div className="mt-4 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
          <span className="text-xs text-yellow-400 font-medium">PRO FEATURE</span>
        </div>

        {/* Tooltip-like hint */}
        <div className="mt-2 text-xs text-gray-400 text-center px-4">
          Click anywhere to upgrade
        </div>
      </div>

      {/* Glowing Border Effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
        style={{
          boxShadow: isHovered 
            ? "0 0 30px rgba(250, 204, 21, 0.4), inset 0 0 30px rgba(168, 85, 247, 0.2)"
            : "0 0 20px rgba(250, 204, 21, 0.2)"
        }}
      />
    </div>
  );
};

export default PremiumFeature;
