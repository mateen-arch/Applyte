import { useState } from "react";
import Sessions from "./Sessions";
import SessionDetail from "./SessionDetail";
import { Button } from "@/components/ui/button";

const InterviewPrep = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
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
              className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
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
};

export default InterviewPrep;

