"use client";

import { useState } from "react";

function githubToRawUrl(url: string): string | null {
  const match = url.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/
  );
  if (!match) return null;
  const [, user, repo, branch, path] = match;
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}

export default function Home() {
  const [file, setFile] = useState("Hello.jsx");
  const [reactCode, setReactCode] = useState("");
  const [nextCode, setNextCode] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8000";

  const fetchFile = async () => {
    try {
      setLoading(true);
      let code = "";
      const rawUrl = githubToRawUrl(file.trim());
      if (rawUrl) {
        // Fetch from GitHub raw URL
        const res = await fetch(rawUrl);
        if (!res.ok) throw new Error("Failed to fetch from GitHub");
        code = await res.text();
      } else {
        // Fallback to backend fetch for local files
        const res = await fetch(`${API}/fetch?file=${encodeURIComponent(file)}`);
        const data = await res.json();
        code = data.code || "";
      }
      setReactCode(code);
      setNextCode("");
    } catch (error) {
      console.error("Error fetching file:", error);
    } finally {
      setLoading(false);
    }
  };

  const migrate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/migrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: reactCode }),
      });
      const data = await res.json();
      setNextCode(data.convertedCode || "");
    } catch (error) {
      console.error("Error migrating code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full px-6 md:px-10 z-50 flex justify-center pt-6">
        <nav className="navbar w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#8b5cf6] mr-2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold heading gradient-text">MigrateAI</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#" className="hover:text-[#c4b5fd] transition-colors">Platform</a>
            <a href="#" className="hover:text-[#c4b5fd] transition-colors">Enterprise</a>
            <a href="#" className="hover:text-[#c4b5fd] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#c4b5fd] transition-colors">Docs</a>
          </div>
          <div className="flex space-x-3">
            <button className="btn btn-outline px-3 py-1 text-sm">Log in</button>
            <button className="btn btn-primary px-3 py-1 text-sm">Sign up</button>
          </div>
        </nav>
      </div>

      <header className="mt-24 mb-16 text-center mx-auto max-w-3xl">
        <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[#c4b5fd] text-sm glass">
          AI-POWERED MIGRATION PLATFORM
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 heading leading-relaxed tracking-wide">
          Transform codebases
          <span className="block mt-3">with a single click</span>
        </h1>
        <p className="text-xl text-[#f5f3ff]/80 mb-8 max-w-2xl mx-auto">
          MigrateAI converts your React codebase to Next.js with 99.8% accuracy, saving hundreds of development hours.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="btn btn-primary px-6 py-3">Start migrating now</button>
          <button className="btn btn-outline px-6 py-3">Book a demo</button>
        </div>
      </header>

      <div className="card p-6 mb-8 glass">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-2 text-[#c4b5fd]" htmlFor="file-input">
              Paste a file path or URL
            </label>
            <input
              id="file-input"
              value={file}
              onChange={(e) => setFile(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,20,0.3)] focus:border-[#8b5cf6] outline-none transition"
              placeholder="Enter file path (e.g. components/Hello.jsx)"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="card p-6 flex flex-col glass">
          <h2 className="text-lg font-semibold mb-3 flex items-center heading">
            <span className="inline-block w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span>
            React Code
          </h2>
          <textarea 
            className="code-area w-full flex-grow p-4 resize-none outline-none min-h-[300px]" 
            value={reactCode} 
            onChange={(e) => setReactCode(e.target.value)}
            placeholder="Paste or edit your React code here..."
          />
          <button 
            onClick={fetchFile} 
            disabled={loading} 
            className="btn btn-primary px-4 py-2 mt-4 w-full">
            {loading ? "Loading..." : "Fetch Code"}
          </button>
        </div>
        <div className="card p-6 flex flex-col glass">
          <h2 className="text-lg font-semibold mb-3 flex items-center heading">
            <span className="inline-block w-3 h-3 rounded-full bg-[#d946ef] mr-2"></span>
            Next.js Code
          </h2>
          <textarea 
            className="code-area w-full flex-grow p-4 resize-none outline-none min-h-[300px]" 
            value={nextCode}
            readOnly
            placeholder="Your Next.js code will appear here..."
          />
          <button 
            onClick={migrate} 
            disabled={loading || !reactCode} 
            className={`btn w-full px-4 py-2 mt-4 ${reactCode ? "btn-primary" : "btn-outline opacity-50 cursor-not-allowed"}`}>
            {loading ? "Processing..." : "Migrate to Next.js"}
          </button>
        </div>
      </div>

      <div className="card p-6 mt-10 mb-4 glass">
        <div className="flex flex-wrap justify-center gap-10 mb-4 text-center">
          <div className="w-full md:w-auto flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3 text-[#d946ef]">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <h3 className="font-medium mb-1 heading">99.8% Accuracy</h3>
            <p className="text-sm text-[#c4b5fd]">Enterprise-grade migration</p>
          </div>
          <div className="w-full md:w-auto flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3 text-[#8b5cf6]">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h3 className="font-medium mb-1 heading">SOC 2 Compliant</h3>
            <p className="text-sm text-[#c4b5fd]">Your code never leaves your network</p>
          </div>
          <div className="w-full md:w-auto flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3 text-[#d946ef]">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4l4 2"></path>
            </svg>
            <h3 className="font-medium mb-1 heading">Save 200+ hours</h3>
            <p className="text-sm text-[#c4b5fd]">Migrate entire codebases in minutes</p>
          </div>
        </div>
      </div>

      <footer className="mt-10 py-8 border-t border-[rgba(255,255,255,0.1)] flex flex-wrap justify-between items-center">
        <div className="flex space-x-8 mb-4 md:mb-0">
          <span className="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-[#d946ef]">
              <path d="M3 19V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="8 12 12 16 16 12"></polyline>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
            Docs
          </span>
          <span className="flex items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 text-[#8b5cf6]">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            API
          </span>
        </div>
        <div className="text-sm text-[#c4b5fd]">
          © 2023 MigrateAI — Y Combinator W23
        </div>
      </footer>
    </main>
  );
}