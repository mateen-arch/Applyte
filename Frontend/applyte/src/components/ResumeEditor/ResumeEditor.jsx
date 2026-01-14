import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wand2,
  TrendingUp,
  Lightbulb,
  Edit2,
  Save,
  X,
  Zap,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";

const ResumeEditor = ({ resume, onResumeUpdate }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [localResume, setLocalResume] = useState(resume);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  useEffect(() => {
    if (resume) {
      setLocalResume(resume);
    }
  }, [resume]);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get(`${base_url}/resume/suggestions`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        toast.success("AI suggestions generated!");
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate suggestions"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = async (suggestion) => {
    try {
      const response = await axios.post(
        `${base_url}/resume/apply-suggestion`,
        {
          fieldPath: suggestion.field_path,
          newValue: suggestion.suggested_value,
          suggestionId: suggestion.id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update local resume
        const updatedResume = response.data.resume;
        setLocalResume(updatedResume);
        setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));

        // Update parent component
        if (onResumeUpdate) {
          onResumeUpdate(updatedResume);
        }

        toast.success("Suggestion applied successfully!");
      }
    } catch (error) {
      console.error("Error applying suggestion:", error);
      toast.error(
        error.response?.data?.message || "Failed to apply suggestion"
      );
    }
  };

  const updateField = async (fieldPath, value) => {
    try {
      // Use the apply-suggestion endpoint which handles field paths better
      const response = await axios.post(
        `${base_url}/resume/apply-suggestion`,
        {
          fieldPath: fieldPath,
          newValue: value,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setLocalResume(response.data.resume);
        if (onResumeUpdate) {
          onResumeUpdate(response.data.resume);
        }
        toast.success("Resume updated!");
        setEditingField(null);
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error(
        error.response?.data?.message || "Failed to update resume"
      );
    }
  };

  const startEditing = (fieldPath, currentValue) => {
    setEditingField(fieldPath);
    setEditValue(currentValue || "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveEdit = () => {
    if (editingField) {
      updateField(editingField, editValue);
    }
  };

  const getFieldValue = (path) => {
    const keys = path.split(/[\[\]\.]/).filter(k => k !== "");
    let value = localResume;
    for (const key of keys) {
      if (value && typeof value === "object") {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* ATS Score & Summary */}
      {suggestions && (
        <Card className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Resume Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {suggestions.overall_assessment}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">
                  {suggestions.ats_score || 0}%
                </div>
                <div className="text-xs text-gray-400">ATS Score</div>
              </div>
            </div>
          </CardHeader>
          {suggestions.summary && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {suggestions.summary.strengths && suggestions.summary.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {suggestions.summary.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-300 list-disc list-inside">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {suggestions.summary.weaknesses && suggestions.summary.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {suggestions.summary.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-gray-300 list-disc list-inside">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Generate Suggestions Button */}
      {!suggestions && (
        <Card className="bg-gradient-to-br from-red-950 to-black border-red-900/50">
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Get AI-Powered Resume Suggestions
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Receive personalized, actionable suggestions to improve your resume
                </p>
              </div>
              <Button
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="bg-yellow-500 text-white hover:bg-yellow-600 border-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions List */}
      {suggestions && suggestions.suggestions && suggestions.suggestions.length > 0 && (
        <Card className="bg-neutral-900 border border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              AI Suggestions ({suggestions.suggestions.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Click "Apply" to instantly update your resume with these improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion, index) => {
                const isApplied = appliedSuggestions.has(suggestion.id);
                const currentValue = getFieldValue(suggestion.field_path);

                return (
                  <div
                    key={suggestion.id || index}
                    className={`p-4 rounded-lg border transition-all ${isApplied
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-gradient-to-br from-red-950 to-black border-red-900/50 hover:border-red-500/50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold">
                            {suggestion.title}
                          </h4>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                          {isApplied && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Applied
                            </Badge>
                          )}
                        </div>

                        {suggestion.current_value && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Current:</p>
                            <p className="text-sm text-white bg-yellow-500 p-2 rounded">
                              {suggestion.current_value}
                            </p>
                          </div>
                        )}

                        {suggestion.suggested_value && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Suggested:</p>
                            <p className="text-sm text-white bg-yellow-500 p-2 rounded border border-yellow-600">
                              {suggestion.suggested_value}
                            </p>
                          </div>
                        )}

                        {suggestion.reason && (
                          <p className="text-xs text-gray-400 mt-2">
                            <span className="text-gray-500">Why:</span> {suggestion.reason}
                          </p>
                        )}

                        {suggestion.impact && (
                          <p className="text-xs text-purple-400 mt-1">
                            <Zap className="w-3 h-3 inline mr-1" />
                            {suggestion.impact}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {!isApplied ? (
                          <Button
                            onClick={() => applySuggestion(suggestion)}
                            size="sm"
                            className="bg-yellow-500 text-white hover:bg-yellow-600 border-none"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Apply
                          </Button>
                        ) : null}

                        <Button
                          onClick={() => startEditing(suggestion.field_path, currentValue)}
                          variant="outline"
                          size="sm"
                          className="bg-yellow-500 text-white hover:bg-yellow-600 border-none"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline Editor Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-neutral-900 border border-neutral-800 max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="text-white">Edit Resume Field</CardTitle>
              <CardDescription className="text-gray-400">
                Field: {editingField}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Value</label>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={6}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={cancelEditing}
                  variant="outline"
                  className="border-neutral-700 text-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={saveEdit}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
