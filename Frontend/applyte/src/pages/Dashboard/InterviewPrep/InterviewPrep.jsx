import { useState } from "react";
import Sessions from "./Sessions";
import SessionDetail from "./SessionDetail";
import { Button } from "@/components/ui/button";
import PremiumFeature from "@/components/PremiumFeature/PremiumFeature";
import { Store } from "@/store/store";

const InterviewPrep = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = Store();

  // Check if user has premium access
  const isPremium = user?.plan?.slug === "pro" || user?.plan?.slug === "business" ||
    user?.subscription?.plan === "pro" || user?.subscription?.plan === "business";

  const interviewPrepContent = (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Interview Prep
            </h1>
            <p className="text-gray-400">
              Create sessions and practice with AI-generated questions.
            </p>
          </div>
          {selectedSessionId && (
            <Button
              variant="outline"
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
              onClick={() => setSelectedSessionId(null)}
            >
              Back to Sessions
            </Button>
          )}
        </div>

        {!selectedSessionId ? (
          <Sessions
            key={refreshKey}
            onSelectSession={(id) => setSelectedSessionId(id)}
            onSessionCreated={() => setRefreshKey((k) => k + 1)}
          />
        ) : (
          <SessionDetail
            sessionId={selectedSessionId}
            onDeleted={() => {
              setSelectedSessionId(null);
              setRefreshKey((k) => k + 1);
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <PremiumFeature
      isPremium={isPremium}
      featureName="Interview Preparation"
      description="Unlock AI-powered interview preparation with custom practice sessions"
      className="flex-1"
    >
      {interviewPrepContent}
    </PremiumFeature>
  );
};

export default InterviewPrep;

