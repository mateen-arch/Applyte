import React, { useState, useEffect } from "react";
import {
    Target,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    TrendingUp,
    BookOpen,
    Copy,
    Check,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { base_url } from "@/lib/constant";
import { toast } from "sonner";

const SkillGapAnalysis = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [resumeSkills, setResumeSkills] = useState([]);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchResumeSkills();
    }, []);

    const fetchResumeSkills = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${base_url}/resume/get-resume`, {
                withCredentials: true,
            });

            if (response.data.success) {
                const resumeData = response.data.resume || response.data.Resume;
                if (resumeData) {
                    const skills = extractSkillsFromResume(resumeData);
                    setResumeSkills(skills);
                }
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractSkillsFromResume = (resume) => {
        const skills = [];
        if (resume.skills && Array.isArray(resume.skills)) {
            skills.push(...resume.skills.map(s => typeof s === 'string' ? s : s.name || s.skill));
        }
        if (resume.experience && Array.isArray(resume.experience)) {
            resume.experience.forEach(exp => {
                if (exp.description) {
                    // Simple extraction for display purposes
                    // The AI will do the heavy lifting for analysis
                    skills.push(...extractSkillsFromText(exp.description));
                }
            });
        }
        return [...new Set(skills.filter(Boolean).map(s => s.trim()))];
    };

    const extractSkillsFromText = (text) => {
        const commonSkills = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
            'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
            'Git', 'Agile', 'Scrum', 'REST', 'API', 'HTML', 'CSS', 'Tailwind',
            'Machine Learning', 'AI', 'Data Science', 'Analytics',
        ];
        const foundSkills = [];
        const lowerText = text.toLowerCase();
        commonSkills.forEach(skill => {
            if (lowerText.includes(skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        });
        return foundSkills;
    };

    const analyzeSkillGap = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${base_url}/ai/analyze-skill-gap`,
                {
                    resumeSkills,
                    jobDescription
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                setAnalysis(response.data.analysis);
                toast.success("AI Analysis complete!");
            } else {
                throw new Error(response.data.message || "Analysis failed");
            }

        } catch (error) {
            console.error("AI Analysis failed:", error);
            toast.error(error.response?.data?.message || "Analysis failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyAnalysis = () => {
        if (!analysis) return;
        const text = `
Skill Gap Analysis Report
==========================

Match Score: ${analysis.matchPercentage}%
Total Required Skills: ${analysis.totalRequired}

✅ Matching Skills (${analysis.matching.length}):
${analysis.matching.map(s => `  • ${s}`).join('\n')}

⚠️ Weak/Partial Skills (${analysis.weak.length}):
${analysis.weak.map(s => `  • ${s}`).join('\n')}

❌ Missing Skills (${analysis.missing.length}):
${analysis.missing.map(s => `  • ${s}`).join('\n')}

Recommendations:
${analysis.recommendations.map(r => `\n${r.title}:\n${r.skills.map(s => `  • ${s}`).join('\n')}\nAction: ${r.action}`).join('\n')}
    `.trim();
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Analysis copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-black min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full -z-10"></div>
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 shadow-lg shadow-yellow-500/5">
                                <Target className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">Skill Gap Analysis</h1>
                                <p className="text-gray-400 mt-1 text-lg">
                                    AI-powered analysis to bridge the gap between your skills and your dream job
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resume Skills Overview */}
                <Card className="bg-yellow-950/20 border-yellow-500/30 mb-6 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Your Resume Skills ({resumeSkills.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resumeSkills.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                <p className="text-gray-400 mb-4">
                                    No skills found in your resume. Please upload a resume first.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                                    onClick={() => window.location.href = "/dashboard"}
                                >
                                    Go to Resume
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {resumeSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Job Description Input */}
                <Card className="bg-yellow-950/20 border-yellow-500/30 mb-6 hover:border-yellow-500/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-white">Enter Job Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="jobDescription" className="text-gray-300 mb-2 block">
                                Paste the job description or list required skills
                            </Label>
                            <Textarea
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="bg-black border-neutral-800 text-white min-h-[200px] focus:border-yellow-500/50"
                                placeholder="Paste job description here... 

Example:
We are looking for a Full Stack Developer with experience in React, Node.js, MongoDB, and AWS. Knowledge of Docker and CI/CD is a plus..."
                            />
                        </div>
                        <Button
                            onClick={analyzeSkillGap}
                            disabled={isLoading || !jobDescription.trim() || resumeSkills.length === 0}
                            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-6 text-lg shadow-lg shadow-yellow-900/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Analyzing with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Analyze Skill Gap with AI
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                {analysis && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Match Score Card */}
                        <Card className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 mb-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <CardContent className="py-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            Overall Match Score
                                        </h3>
                                        <p className="text-gray-400">
                                            Based on {analysis.totalRequired} required skills identified by AI
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-6xl font-bold text-yellow-500">
                                            {analysis.matchPercentage}%
                                        </div>
                                    </div>
                                </div>
                                <Progress
                                    value={analysis.matchPercentage}
                                    className="h-4 bg-neutral-900"
                                    indicatorClassName="bg-yellow-500"
                                />
                            </CardContent>
                        </Card>

                        {/* Skills Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Matching Skills */}
                            <Card className="bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                                        <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                        Matching Skills
                                    </CardTitle>
                                    <p className="text-sm text-gray-400">
                                        {analysis.matching.length} skills found
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {analysis.matching.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No matching skills found</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {analysis.matching.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 rounded bg-yellow-500/5 border border-yellow-500/10">
                                                    <CheckCircle2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                                    <span className="text-gray-200 text-sm">{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Weak Skills */}
                            <Card className="bg-yellow-950/10 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                                        <AlertTriangle className="w-5 h-5 text-yellow-500/70" />
                                        Weak/Partial Skills
                                    </CardTitle>
                                    <p className="text-sm text-gray-400">
                                        {analysis.weak.length} skills need strengthening
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {analysis.weak.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No weak skills identified</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {analysis.weak.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 rounded bg-yellow-900/20 border border-yellow-500/20">
                                                    <AlertTriangle className="w-4 h-4 text-yellow-500/70 flex-shrink-0" />
                                                    <span className="text-gray-300 text-sm">{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Missing Skills */}
                            <Card className="bg-yellow-950/10 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        Missing Skills
                                    </CardTitle>
                                    <p className="text-sm text-gray-400">
                                        {analysis.missing.length} skills to learn
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {analysis.missing.length === 0 ? (
                                        <div className="text-center py-4">
                                            <CheckCircle2 className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                            <p className="text-yellow-500 text-sm font-medium">
                                                You have all required skills!
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {analysis.missing.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 rounded bg-red-900/10 border border-red-500/20">
                                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                    <span className="text-gray-400 text-sm">{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recommendations */}
                        {analysis.recommendations.length > 0 && (
                            <Card className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-500/20 mb-6">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-yellow-500" />
                                        AI Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {analysis.recommendations.map((rec, index) => (
                                        <div key={index} className="space-y-3 p-4 rounded-lg bg-black/40 border border-white/5">
                                            <h4 className="text-white font-medium flex items-center gap-2 text-lg">
                                                <TrendingUp className="w-5 h-5 text-yellow-500" />
                                                {rec.title}
                                            </h4>
                                            <div className="pl-7 flex flex-wrap gap-2">
                                                {rec.skills.map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-300 pl-7 flex items-start gap-2">
                                                <span className="text-xl">💡</span>
                                                <span className="mt-1">{rec.action}</span>
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pb-8">
                            <Button
                                variant="outline"
                                onClick={copyAnalysis}
                                className="border-neutral-800 text-gray-300 hover:bg-neutral-900 hover:text-white"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Analysis
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillGapAnalysis;
