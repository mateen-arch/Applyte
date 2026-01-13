import React from "react";
import { Check, Star, Zap, Crown } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for getting started",
    price: "Free",
    period: "forever",
    popular: false,
    icon: Star,
    features: [
      "Resume parsing",
      "10 job matches per month",
      "3 cover letters monthly",
      "Basic resume optimization",
      "Email support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    description: "Most popular for job seekers",
    price: "$9",
    period: "per month",
    popular: true,
    icon: Zap,
    features: [
      "Unlimited resume parsing",
      "Unlimited job matches",
      "Unlimited cover letters",
      "Advanced resume optimization",
      "ATS optimization",
      "Resume tailoring",
      "Priority support"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "primary"
  },
  {
    name: "Business",
    description: "For maximum results",
    price: "$19",
    period: "per month",
    popular: false,
    icon: Crown,
    features: [
      "Everything in Pro",
      "AI interview coach",
      "LinkedIn optimization",
      "Custom templates",
      "Phone support",
      "Advanced analytics"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline"
  }
];

const Pricing = () => {
  return (
    <div className="relative py-24 bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(60,60,60,0.3),transparent_70%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
            Start free and upgrade when you're ready. All plans include core features.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border transition-all duration-500 overflow-hidden ${
                  plan.popular 
                    ? "border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.1)]" 
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700">
                      <IconComponent className="w-5 h-5 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-200">{plan.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period !== "forever" && (
                      <span className="text-gray-400 text-base ml-1">/mo</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {plan.period === "forever" ? "No credit card required" : "14-day free trial"}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    plan.buttonVariant === "primary"
                      ? "bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-transparent border border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              No hidden fees
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Secure payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;