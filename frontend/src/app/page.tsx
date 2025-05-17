"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState("Hello.jsx");
  const [reactCode, setReactCode] = useState("");
  const [nextCode, setNextCode] = useState("");

  const API = "http://localhost:8000";

  const fetchFile = async () => {
    const res = await fetch(`${API}/fetch?file=${encodeURIComponent(file)}`);
    const data = await res.json();
    setReactCode(data.code || "");
    setNextCode("");
  };

  const migrate = async () => {
    const res = await fetch(`${API}/migrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: reactCode }),
    });
    const data = await res.json();
    setNextCode(data.convertedCode || "");
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 Code Migration Copilot</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={file}
          onChange={(e) => setFile(e.target.value)}
          className="border px-2 py-1 w-72"
          placeholder="Enter file (e.g. Hello.jsx)"
        />
        <button onClick={fetchFile} className="bg-blue-600 text-white px-3 py-1 rounded">Fetch</button>
        <button onClick={migrate} className="bg-green-600 text-white px-3 py-1 rounded">Migrate</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold">React Code</h2>
          <textarea className="w-full h-72 border p-2" value={reactCode} readOnly />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Next.js Code</h2>
          <textarea className="w-full h-72 border p-2" value={nextCode} readOnly />
        </div>
      </div>
    </main>
  );
}