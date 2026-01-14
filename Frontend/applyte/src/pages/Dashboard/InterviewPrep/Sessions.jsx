import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { base_url } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Sessions = ({ onSelectSession, onSessionCreated }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topics, setTopics] = useState("");
  const [desc, setDesc] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("10");

  const canSubmit = useMemo(() => {
    const expNum = Number(experience);
    const n = Number(numberOfQuestions);
    return (
      role.trim().length > 1 &&
      topics.trim().length > 1 &&
      experience !== "" &&
      !Number.isNaN(expNum) &&
      expNum >= 0 &&
      !Number.isNaN(n) &&
      n >= 1 &&
      n <= 30
    );
  }, [role, topics, experience, numberOfQuestions]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/session/get-all-sessions`, {
        withCredentials: true,
      });
      if (res.data?.success) setSessions(res.data.sessions || []);
      else toast.error(res.data?.message || "Failed to load sessions");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setRole("");
    setExperience("");
    setTopics("");
    setDesc("");
    setNumberOfQuestions("10");
  };

  const createSession = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setCreating(true);

      // 1) Generate questions via AI API (existing backend contract)
      const qRes = await axios.post(
        `${base_url}/ai/generate-questions`,
        {
          role: role.trim(),
          experience: Number(experience),
          topics: topics.trim(),
          desc: desc.trim(),
          numberOfQuestions: Number(numberOfQuestions),
        },
        { withCredentials: true }
      );

      if (!qRes.data?.success || !Array.isArray(qRes.data?.questions)) {
        toast.error(qRes.data?.message || "Failed to generate questions");
        return;
      }

      // 2) Create session via session API
      const sRes = await axios.post(
        `${base_url}/session/create-session`,
        {
          role: role.trim(),
          experience: Number(experience),
          topics: topics.trim(),
          desc: desc.trim(),
          questions: qRes.data.questions,
        },
        { withCredentials: true }
      );

      if (sRes.data?.success) {
        toast.success(sRes.data?.message || "Session created");
        setOpen(false);
        resetForm();
        await fetchSessions();
        onSessionCreated?.();
      } else {
        toast.error(sRes.data?.message || "Failed to create session");
      }
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Sessions</h2>
          <p className="text-sm text-gray-500">
            Click a card to open questions.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          onClick={() => setOpen(true)}
        >
          Create Session
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-400">Loading sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        <Card className="bg-neutral-900/70 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">No sessions yet</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">
            Create a session to generate interview questions and answers.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessions
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((s) => (
              <button
                key={s._id}
                onClick={() => onSelectSession?.(s._id)}
                className="text-left group"
              >
                <Card className="relative overflow-hidden bg-neutral-900/60 backdrop-blur border-neutral-800 transition-all hover:border-neutral-700 hover:bg-neutral-900/85 hover:shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />
                  <CardHeader className="relative">
                    <CardTitle className="text-white truncate">
                      {s.role || "Session"}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </CardHeader>
                  <CardContent className="relative space-y-2">
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">Topics:</span>{" "}
                      <span className="text-gray-200">{s.topics || "-"}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">Experience:</span>{" "}
                      <span className="text-gray-200">
                        {s.experiance ?? "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(v) => (!creating ? setOpen(v) : null)}>
        <DialogContent className="bg-neutral-950 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Create Interview Prep Session</DialogTitle>
          </DialogHeader>

          <form onSubmit={createSession} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Role *</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="bg-neutral-900 border-neutral-800 text-white"
                disabled={creating}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-200">Experience (years) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 2"
                  className="bg-neutral-900 border-neutral-800 text-white"
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Questions *</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-white"
                  disabled={creating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Topics *</Label>
              <Input
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g. React, JS, System Design"
                className="bg-neutral-900 border-neutral-800 text-white"
                disabled={creating}
              />
              <p className="text-xs text-gray-500">
                Tip: comma-separated topics work best.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200">Description (optional)</Label>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Any additional context..."
                className="bg-neutral-900 border-neutral-800 text-white min-h-24"
                disabled={creating}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-neutral-800 bg-neutral-950 text-white hover:bg-neutral-900"
                onClick={() => {
                  if (!creating) setOpen(false);
                }}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || creating}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {creating ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;

