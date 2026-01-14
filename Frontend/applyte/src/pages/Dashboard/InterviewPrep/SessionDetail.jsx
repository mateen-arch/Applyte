import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base_url } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormattedText from "./FormattedText";

const SessionDetail = ({ sessionId, onDeleted }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [answerOpen, setAnswerOpen] = useState(() => ({}));
  const [explainOpen, setExplainOpen] = useState(false);
  const [activeExplain, setActiveExplain] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const fetchSession = async () => {
    try {
      setLoading(true);
      // Use current backend route exactly as defined
      const res = await axios.get(
        `${base_url}/session/get-session-by-id/${sessionId}`,
        { withCredentials: true }
      );
      if (res.data?.success) {
        setSession(res.data.session);
        setQuestions(res.data.questions || []);
      } else {
        toast.error(res.data?.message || "Failed to load session");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const metaLine = useMemo(() => {
    if (!session) return "";
    const parts = [];
    if (session.topics) parts.push(`Topics: ${session.topics}`);
    if (session.experiance !== undefined && session.experiance !== null)
      parts.push(`Experience: ${session.experiance}`);
    return parts.join(" • ");
  }, [session]);

  const toggleAnswer = (qid) => {
    setAnswerOpen((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const openExplanation = async (q) => {
    setActiveExplain(q);
    setExplainOpen(true);

    // Explanations are already generated and stored when the session is created.
    // We simply surface the stored explanation from the question's note.
    setExplainLoading(false);
  };

  const deleteSession = async () => {
    try {
      // Use current backend delete route exactly as defined
      const res = await axios.delete(
        `${base_url}/session/delete-session/${sessionId}`,
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success(res.data?.message || "Session deleted");
        onDeleted?.();
      } else {
        toast.error(res.data?.message || "Failed to delete session");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete session");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-400">Loading questions...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="bg-neutral-900/70 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Session not found</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400">
          Please go back and select a session again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="bg-yellow-950/20 backdrop-blur border-yellow-500/30 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700" />
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-white truncate">
              {session.role || "Interview Session"}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">{metaLine}</p>
          </div>
          <Button
            variant="outline"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
            onClick={deleteSession}
          >
            Delete
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {questions.length === 0 ? (
          <Card className="bg-neutral-900/70 border-neutral-800">
            <CardContent className="text-gray-400 py-6">
              No questions found for this session.
            </CardContent>
          </Card>
        ) : (
          questions.map((q, idx) => (
            <Card
              key={q._id}
              className="bg-yellow-950/10 backdrop-blur border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base leading-snug">
                  <span className="text-yellow-500 mr-2">Q{idx + 1}</span>
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-yellow-500/30 bg-yellow-950/20 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                    onClick={() => toggleAnswer(q._id)}
                  >
                    {answerOpen[q._id] ? "Hide Answer" : "See Answer"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-500/30 bg-yellow-950/20 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                    onClick={() => openExplanation(q)}
                  >
                    Explanation
                  </Button>
                </div>

                {answerOpen[q._id] && (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                    <FormattedText text={q.answer} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Right-side explanation bar */}
      <Dialog open={explainOpen} onOpenChange={setExplainOpen}>
        <DialogContent className="bg-neutral-950/95 backdrop-blur border-neutral-800 text-white p-0 sm:max-w-none w-[94vw] sm:w-[560px] h-[92vh] sm:h-screen fixed right-0 top-0 translate-x-0 translate-y-0 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="p-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-950/40">
            <DialogHeader>
              <DialogTitle className="text-white">
                {activeExplain?.note?.title || "Explanation"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {activeExplain?.question}
            </p>
          </div>

          <div className="p-6 overflow-y-auto h-[calc(92vh-92px)] sm:h-[calc(100vh-92px)]">
            {explainLoading ? (
              <div className="flex items-center text-gray-400">
                <div className="w-5 h-5 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3">Generating explanation...</span>
              </div>
            ) : (
              <FormattedText
                text={activeExplain?.note?.desc || "No explanation available."}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionDetail;

