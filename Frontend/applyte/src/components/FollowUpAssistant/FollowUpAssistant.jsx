import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";

const FollowUpAssistant = ({ isOpen, onClose, application }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [formData, setFormData] = useState({
    daysSinceApplication: 7,
    emailType: "follow_up",
  });
  const [editedEmail, setEditedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const calculateDaysSince = () => {
    if (!application?.dateApplied) return 7;
    const days = Math.floor(
      (new Date() - new Date(application.dateApplied)) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 7;
  };

  React.useEffect(() => {
    if (isOpen && application) {
      setFormData({
        daysSinceApplication: calculateDaysSince(),
        emailType: "follow_up",
      });
      setEmailData(null);
      setEditedEmail("");
      setCopied(false);
    }
  }, [isOpen, application]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${base_url}/applications/follow-up/generate`,
        {
          applicationId: application._id,
          daysSinceApplication: formData.daysSinceApplication,
          emailType: formData.emailType,
        },
        { withCredentials: true }
      );

      if (response.data.success && response.data.email) {
        setEmailData(response.data.email);
        setEditedEmail(response.data.email.body || "");
      }
    } catch (error) {
      console.error("Error generating follow-up email:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate follow-up email"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editedEmail || emailData?.body || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AI Follow-Up Assistant
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Generate professional follow-up emails for {application.jobTitle} at{" "}
            {application.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="daysSince" className="text-gray-300">
                Days Since Application
              </Label>
              <Input
                id="daysSince"
                type="number"
                min="1"
                value={formData.daysSinceApplication}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    daysSinceApplication: parseInt(e.target.value) || 7,
                  })
                }
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailType" className="text-gray-300">
                Email Type
              </Label>
              <Select
                value={formData.emailType}
                onValueChange={(value) =>
                  setFormData({ ...formData, emailType: value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="follow_up">Follow-Up</SelectItem>
                  <SelectItem value="thank_you">Thank You</SelectItem>
                  <SelectItem value="status_check">Status Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Follow-Up Email
              </>
            )}
          </Button>

          {/* Generated Email */}
          {emailData && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-300">Subject</Label>
                  <span className="text-xs text-gray-500">
                    {emailData.subject?.length || 0} characters
                  </span>
                </div>
                <Input
                  value={emailData.subject || ""}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-300">Email Body</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="border-neutral-700 text-gray-300 hover:bg-neutral-700"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 text-white min-h-[300px] font-mono text-sm"
                  placeholder="Generated email will appear here..."
                />
              </div>

              {emailData.keyPoints && emailData.keyPoints.length > 0 && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/50">
                  <Label className="text-purple-300 mb-2 block">Key Points</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {emailData.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-neutral-700 text-gray-300 hover:bg-neutral-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpAssistant;
