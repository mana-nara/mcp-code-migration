"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState("Hello.jsx");
  const [reactCode, setReactCode] = useState("");
  const [nextCode, setNextCode] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8000";

  const fetchFile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/fetch?file=${encodeURIComponent(file)}`);
      const data = await res.json();
      setReactCode(data.code || "");
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
          <a href="#demo-section" className="btn btn-primary px-4 py-2 flex items-center font-medium hover:bg-[#a78bfa] transition-colors">
            Try Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
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
          <a href="#demo-section" className="btn btn-primary px-6 py-3 flex items-center">
            Start migrating now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </a>
          <button className="btn btn-outline px-6 py-3">Book a demo</button>
        </div>
      </header>

      <section className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 heading">Why Should You Choose MigrateAI</h2>
          <p className="text-xl text-[#f5f3ff]/70 max-w-3xl mx-auto">
            Industry-leading enterprises rely on our platform to accelerate their migration journey
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
            <h3 className="text-xl font-bold mb-2 heading">AI-Powered Precision</h3>
            <p className="text-[#f5f3ff]/70">
              Our advanced AI models have been trained on millions of lines of code to deliver 99.8% accuracy in code transformations, ensuring a smooth transition to Next.js.
            </p>
          </div>
          
          <div className="card p-6 glass">
            <div className="mb-4 text-[#d946ef]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 heading">Save Weeks of Development</h3>
            <p className="text-[#f5f3ff]/70">
              What takes teams weeks to migrate manually can be done in minutes. Our customers report saving an average of 200+ development hours per project.
            </p>
          </div>
          
          <div className="card p-6 glass">
            <div className="mb-4 text-[#8b5cf6]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 heading">Enterprise Ready</h3>
            <p className="text-[#f5f3ff]/70">
              SOC 2 compliant with secure deployment options. Keep your code secure with on-premises options and no data retention.
            </p>
          </div>
        </div>
        
        <div className="border border-[rgba(255,255,255,0.1)] rounded-xl p-8 mb-16 glass">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
              <h3 className="text-2xl font-bold mb-4 heading">Seamless Migration Process</h3>
              <p className="text-[#f5f3ff]/70 mb-6">
                Our platform handles the complex transformations required when moving from React to Next.js, including:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Converting React Router to Next.js routing system</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Restructuring components for the App Router</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Adapting data fetching strategies</span>
                </li>
                <li className="flex items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#d946ef] mr-2 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Implementing server components and client boundaries</span>
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
            <h3 className="text-2xl font-bold mb-4 heading">Ready to experience the power of MigrateAI?</h3>
            <p className="text-xl text-[#f5f3ff]/70 mb-6 max-w-2xl mx-auto">
              Try our demo below with your own React code or use our examples to see the magic happen in seconds.
            </p>
            <a href="#demo-section" className="btn btn-primary px-6 py-3 inline-flex items-center">
              Try the demo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
                <path d="M7 17L17 7"/>
                <path d="M7 7h10v10"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="card p-6 mb-8 glass" id="demo-section">
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