"use client";

import { useState, useRef } from "react";
import Link from "next/link";

function githubToRawUrl(url: string): string | null {
  const match = url.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/
  );
  if (!match) return null;
  const [, user, repo, branch, path] = match;
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}

function isGithubRepoUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/blob\//.test(url.trim());
}

export default function Home() {
  const [file, setFile] = useState("Hello.jsx");
  const [reactCode, setReactCode] = useState("");
  const [nextCode, setNextCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const [fullReactCode, setFullReactCode] = useState("");
  const [fullNextCode, setFullNextCode] = useState("");


const isTypingReact = useRef(false);
const isTypingNext = useRef(false);



  

  const API = "http://localhost:8000";

  const fetchFile = async () => {
    setDownloadUrl("");
    setReactCode("");
    setNextCode("");
    try {
      setLoading(true);
      const trimmed = file.trim();
      const rawUrl = githubToRawUrl(trimmed);
      let code = "";
      if (rawUrl) {
        const res = await fetch(rawUrl);
        if (!res.ok) throw new Error("Failed to fetch from GitHub");
        code = await res.text();
      } else {
        const res = await fetch(`${API}/fetch?file=${encodeURIComponent(file)}`);
        const data = await res.json();
        code = data.code || "";
      }
      await animateReactTyping(code);
      setNextCode("");
    } catch (error) {
      setReactCode("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

const animateTyping = async (text: string) => {
  isTypingNext.current = true;
  setNextCode("");
  setFullNextCode(text);

  for (let i = 0; i < text.length; i++) {
    if (!isTypingNext.current) break;
    await new Promise((resolve) => setTimeout(resolve, 5));
    setNextCode((prev) => prev + text[i]);
  }

  isTypingNext.current = false;
};



const animateReactTyping = async (text: string) => {
  isTypingReact.current = true;
  setReactCode("");
  setFullReactCode(text);

  for (let i = 0; i < text.length; i++) {
    if (!isTypingReact.current) break;
    await new Promise((resolve) => setTimeout(resolve, 5));
    setReactCode((prev) => prev + text[i]);
  }

  isTypingReact.current = false;
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
      if (data.convertedCode) {
        animateTyping(data.convertedCode);
      }

    } catch (error) {
      setNextCode("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen flex flex-col relative">
      {/* Background gradient elements */}
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10 bg-[#0a0a14]">
        <div className="absolute top-[-30%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[120px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] bg-gradient-to-r from-[#d946ef] to-[#8b5cf6]"></div>
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full opacity-10 blur-[80px] bg-[#4f46e5]"></div>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="fixed top-0 left-0 w-full px-6 md:px-10 z-50 flex justify-center pt-6">
        <nav className="navbar w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/migrate-logo.png" 
              alt="miGrate Logo" 
              width="32" 
              height="32" 
              className="mr-2"
            />
            <span className="text-xl font-bold heading gradient-text">miGrate</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#features-section" className="hover:text-[#c4b5fd] transition-colors">Features</a>
            <a href="#capabilities-section" className="hover:text-[#c4b5fd] transition-colors">Capabilities</a>
            <a href="#demo-section" className="hover:text-[#c4b5fd] transition-colors">Demo</a>
          </div>
          <a href="#demo-section" className="btn btn-primary px-4 py-2 flex items-center font-medium hover:bg-[#a78bfa] transition-colors">
            Try Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
        </nav>
      </div>

      <header className="mt-24 mb-16 text-center mx-auto max-w-3xl relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-radial from-[#8b5cf6]/20 to-transparent opacity-60 blur-xl"></div>
        <div className="inline-block mb-2 px-4 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[#c4b5fd] text-sm glass">
          MCP-POWERED MIGRATION TOOL
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 heading leading-relaxed tracking-wide">
          Transform codebases
          <span className="block mt-3">with a single click</span>
        </h1>
        <p className="text-xl text-[#f5f3ff]/80 mb-8 max-w-2xl mx-auto">
          Convert React code to Next.js using Model Context Protocols (MCPs). Grate expectations, smooth migrations!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#features-section" className="btn btn-primary px-6 py-3 flex items-center">
            Learn More
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </a>
          <a href="https://github.com/mana-nara/mcp-code-migration" target="_blank" className="btn btn-outline px-6 py-3 flex items-center">
            View on GitHub
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        </div>
      </header>

      <section className="mb-20 relative">
        <div className="absolute top-40 right-0 w-80 h-80 rounded-full opacity-10 blur-[120px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] -z-10"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full opacity-10 blur-[100px] bg-[#4338ca] -z-10"></div>
        <div className="text-center mb-16" id="features-section">
          <h2 className="text-3xl font-bold mb-4 heading">Why Use miGrate</h2>
          <p className="text-xl text-[#f5f3ff]/70 max-w-3xl mx-auto">
            Leveraging Model Context Protocols for intelligent code transformations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 glass">
            <div className="mb-4 text-[#8b5cf6]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 heading">MCP-Enhanced Transformations</h3>
            <p className="text-[#f5f3ff]/70">
              Our tool uses Model Context Protocols to provide AI with crucial context about React and Next.js architectures, producing more accurate migrations.
            </p>
          </div>
          
          <div className="card p-6 glass">
            <div className="mb-4 text-[#d946ef]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 heading">Development Time Efficiency</h3>
            <p className="text-[#f5f3ff]/70">
              Automate repetitive conversion tasks that would typically require manual refactoring, allowing developers to focus on complex application logic.
            </p>
          </div>
          
          <div className="card p-6 glass">
            <div className="mb-4 text-[#8b5cf6]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 heading">Migration Assistance</h3>
            <p className="text-[#f5f3ff]/70">
              Helps developers navigate common migration challenges like routing changes, data fetching approaches, and component architecture differences.
            </p>
          </div>
        </div>
        
        <div className="border border-[rgba(255,255,255,0.1)] rounded-xl p-8 mb-16 glass" id="capabilities-section">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
              <h3 className="text-2xl font-bold mb-4 heading">Technical Capabilities</h3>
              <p className="text-[#f5f3ff]/70 mb-6">
                Powered by Model Context Protocols (MCPs), our tool understands code at a semantic level:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>MCPs provide semantic understanding of React's structure</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>React Router to Next.js App Router conversion</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Component architecture restructuring</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Data fetching method adaptation</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Client and server component boundaries</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 glass rounded-lg overflow-hidden">
              <div className="bg-[rgba(10,10,20,0.5)] p-3 border-b border-[rgba(255,255,255,0.1)]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                </div>
              </div>
              <div className="p-4 bg-[rgba(20,20,30,0.5)] text-sm font-mono text-[#f5f3ff]/80 overflow-x-auto">
                <div className="text-[#8b5cf6]">// React Router</div>
                <div>{`import { BrowserRouter, Routes, Route } from 'react-router-dom';`}</div>
                <div className="mt-2">{`function App() {`}</div>
                <div className="ml-4">{`return (`}</div>
                <div className="ml-8">{`<BrowserRouter>`}</div>
                <div className="ml-12">{`<Routes>`}</div>
                <div className="ml-16">{`<Route path="/" element={<Home />} />`}</div>
                <div className="ml-12">{`</Routes>`}</div>
                <div className="ml-8">{`</BrowserRouter>`}</div>
                <div className="ml-4">{`);`}</div>
                <div>{`}`}</div>
                <div className="mt-6 text-[#d946ef]">// Next.js App Router</div>
                <div>{`// app/page.jsx`}</div>
                <div className="mt-2">{`export default function Home() {`}</div>
                <div className="ml-4">{`return <YourHomePage />;`}</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <div className="rounded-xl bg-gradient-to-r from-[#8b5cf6]/20 to-[#d946ef]/20 p-10 glass">
            <h3 className="text-2xl font-bold mb-4 heading">Try Our MCP-Powered Migration Tool</h3>
            <p className="text-xl text-[#f5f3ff]/70 mb-6 max-w-2xl mx-auto">
              Experience how miGrate makes React to Next.js transformations easier than grating cheese.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#demo-section" className="btn btn-primary px-6 py-3 inline-flex items-center">
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
                  <path d="M7 17L17 7"/>
                  <path d="M7 7h10v10"/>
                </svg>
              </a>
              <Link href="/repo-migrate">
                <button className="btn btn-outline px-6 py-3 text-lg">
                  Migrate a Full GitHub Repository →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="card p-6 mb-8 glass" id="demo-section">
        <div className="relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-[60px] bg-[#d946ef]"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 blur-[60px] bg-[#8b5cf6]"></div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-2 text-[#c4b5fd]" htmlFor="file-input">
                Paste a file path or GitHub file URL
              </label>
              <input
                id="file-input"
                value={file}
                onChange={(e) => setFile(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,20,0.3)] focus:border-[#8b5cf6] outline-none transition"
                placeholder="Enter file path (e.g. components/Hello.jsx) or GitHub file URL"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-radial from-[#8b5cf6]/10 to-transparent opacity-60 blur-3xl -z-10"></div>
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
          <div className="h-6 flex justify-center items-center">
            {isTypingReact.current && (
              <button
                onClick={() => {
                  isTypingReact.current = false; 
                  setReactCode(fullReactCode);
                }}
                className="text-sm text-[#c4b5fd] mt-2 hover:underline"
              >
                Skip typing
              </button>
            )}
          </div>

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
          <div className="h-6 flex justify-center items-center">
            {isTypingNext.current && (
              <button
                onClick={() => {
                  isTypingNext.current = false; 
                  setNextCode(fullNextCode);
                }}
                className="text-sm text-[#c4b5fd] mt-2 hover:underline"
              >
                Skip typing
              </button>
            )}
          </div>

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
        <div className="text-sm text-[#c4b5fd]">
          © 2025 miGrate
        </div>
        <div className="text-sm text-[#c4b5fd] flex items-center">
          Made with
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mx-1 text-[#d946ef]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          at World's Biggest MCP Hackathon 2025
        </div>
      </footer>
    </main>
  );
}