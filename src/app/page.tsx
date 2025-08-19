"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, Check, Sparkles, Code, FileText } from "lucide-react";

interface StructuredPrompt {
  role: string;
  context: string;
  task: string;
  format: string;
  constraints: string[];
  examples?: string[];
  tone: string;
  outputFormat: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<{
    originalPrompt: string;
    requirements: string;
    structuredPrompt: Record<string, unknown>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConvert = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          requirements: requirements.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to convert prompt");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to convert prompt. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;

    const jsonString = JSON.stringify(result.structuredPrompt, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold text-white">
                Prompt Converter
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/ashutosh-rath02/json-prompt"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white/80">
              AI-Powered Prompt Structuring
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Convert Prompts to
            <span className="text-white"> Structured JSON</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Transform your natural language prompts into structured,
            machine-readable JSON format for consistent and effective AI
            interactions.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Input Prompt</h2>
              <p className="text-white/60 text-sm">
                Enter your natural language prompt below
              </p>
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write a comprehensive blog post about sustainable technology trends in 2024, including practical examples and actionable insights for businesses..."
            rows={5}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none font-medium"
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Requirements (Optional)
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g., Include fields for: target audience, content length, SEO keywords, call-to-action, or leave empty for auto-generated structure"
              rows={3}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none font-medium"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !prompt.trim()}
            className="mt-6 bg-white hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Code className="w-5 h-5" />
                Convert to JSON
              </>
            )}
          </button>
        </div>

        {/* JSON Output Section */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    JSON Output
                  </h2>
                  <p className="text-white/60 text-sm">
                    Copy the structured JSON below
                  </p>
                  {result.requirements && (
                    <p className="text-white/40 text-xs mt-1">
                      Based on: {result.requirements}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 text-sm font-medium text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>

            <pre className="bg-black border border-white/10 rounded-xl p-6 overflow-x-auto text-sm text-white/80 font-mono leading-relaxed">
              {JSON.stringify(result.structuredPrompt, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-white/40 text-sm">
            Built with Next.js and Tailwind CSS •
            <span className="text-white/60 ml-1">
              Inspired by Vercel&apos;s design system
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
