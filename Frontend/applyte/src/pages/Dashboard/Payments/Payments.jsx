import React, { useState } from "react";
import { Check, Star, Zap, Crown, ArrowLeft, Sparkles, CreditCard, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Store } from "@/store/store";
import { toast } from "sonner";
import axios from "axios";
import { base_url } from "@/lib/constant";

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
    buttonText: "Current Plan",
    buttonVariant: "outline",
    disabled: true
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
      "AI Resume Customization",
      "ATS optimization",
      "Resume tailoring",
      "Priority support"
    ],
    buttonText: "Upgrade to Pro",
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
    buttonText: "Upgrade to Business",
    buttonVariant: "outline"
  }
];

const Payments = () => {
  const navigate = useNavigate();
  const { user, setUser } = Store();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Prefer plan over subscription field for backward compatibility
  const currentPlan = user?.plan?.slug || user?.subscription?.plan || "free";

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field, value) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
      if (value.replace(/\s/g, "").length > 16) return;
    } else if (field === "expiryDate") {
      value = formatExpiryDate(value);
      if (value.replace(/\//g, "").length > 4) return;
    } else if (field === "cvv") {
      value = value.replace(/[^0-9]/gi, "");
      if (value.length > 3) return;
    }

    setCardDetails({ ...cardDetails, [field]: value });
  };

  const validateCardDetails = () => {
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardDetails.cardName.trim()) {
      toast.error("Please enter cardholder name");
      return false;
    }
    if (cardDetails.expiryDate.replace(/\//g, "").length !== 4) {
      toast.error("Please enter valid expiry date (MM/YY)");
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      toast.error("Please enter valid CVV");
      return false;
    }
    return true;
  };

  const handleUpgrade = async (planName) => {
    if (planName === "Basic") return;

    // Validate card details
    if (!validateCardDetails()) {
      return;
    }

    setIsProcessing(true);
    try {
      // Map plan name to backend plan value
      const planMap = {
        "Pro": "pro",
        "Business": "business"
      };

      const planValue = planMap[planName];
      if (!planValue) {
        toast.error("Invalid plan selected");
        setIsProcessing(false);
        return;
      }

      toast.info(`Processing payment for ${planName} plan...`);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update subscription via backend
      const response = await axios.put(
        `${base_url}/user/subscription`,
        {
          plan: planValue,
          status: "active"
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Update user in store with plan and subscription
        const updatedUser = {
          ...user,
          plan: response.data.plan || user.plan,
          subscription: response.data.subscription || user.subscription
        };
        setUser(updatedUser);

        toast.success(`Successfully upgraded to ${planName}! 🎉`);
        toast.info("This was a demo payment - no charges made");

        // Clear card details
        setCardDetails({
          cardNumber: "",
          cardName: "",
          expiryDate: "",
          cvv: "",
        });
        setSelectedPlan(null);

        // Refresh page to show updated features
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to process payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-purple-500/20 border border-yellow-500/30">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Upgrade to Pro</h1>
              <p className="text-gray-400">
                Unlock premium features and accelerate your job search
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan Badge */}
        {currentPlan !== "free" && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">
                You're currently on the <span className="text-green-400 capitalize">{currentPlan}</span> plan
              </span>
            </div>
          </div>
        )}

        {/* Demo Payment Warning */}
        <Card className="bg-gradient-to-r from-yellow-900/20 to-red-900/20 border border-yellow-500/50 mb-8">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">Demo Mode - Test Environment</h3>
                <p className="text-gray-300 text-sm">
                  This is a demonstration payment system. Enter dummy card details below.
                  <span className="font-semibold text-yellow-300"> No real charges will be made.</span>
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Test Card: 4242 4242 4242 4242 | Expiry: Any future date | CVV: Any 3 digits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Payment Information
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your card details to complete the upgrade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="cardNumber" className="text-gray-300">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="cardName" className="text-gray-300">
                  Cardholder Name
                </Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => handleCardInputChange("cardName", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-gray-300">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => handleCardInputChange("expiryDate", e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-gray-300">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isCurrentPlan = plan.name.toLowerCase() === currentPlan;

            return (
              <Card
                key={index}
                className={`relative bg-gradient-to-br from-neutral-900 to-black border transition-all duration-500 overflow-hidden ${plan.popular
                  ? "border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.1)] scale-105"
                  : "border-neutral-800 hover:border-neutral-600"
                  } ${isCurrentPlan ? "ring-2 ring-green-500/50" : ""}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 bg-neutral-800 rounded-lg border border-neutral-700">
                      <IconComponent className="w-5 h-5 text-gray-300" />
                    </div>
                    <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 text-sm mb-4">
                    {plan.description}
                  </CardDescription>

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
                </CardHeader>

                <CardContent>
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
                  <Button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isProcessing || plan.disabled || isCurrentPlan}
                    className={`w-full transition-all duration-300 ${plan.buttonVariant === "primary"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg hover:shadow-yellow-500/50"
                      : "bg-transparent border border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600"
                      } ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-neutral-900 border border-neutral-800">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
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
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                14-day money-back guarantee
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
