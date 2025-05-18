"use client";
import { useState } from "react";
import Link from "next/link";

function isGithubRepoUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/.test(url.trim().replace(/\/$/, ""));
}

export default function RepoMigrate() {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoFiles, setRepoFiles] = useState<string[]>([]);
  const [repoId, setRepoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:8000";

  const fetchRepoFiles = async () => {
    setRepoFiles([]);
    setRepoId(null);
    setDownloadUrl("");
    setError("");
    try {
      setLoading(true);
      const trimmed = repoUrl.trim();
      if (!isGithubRepoUrl(trimmed)) {
        setError("Please enter a valid GitHub repository URL.");
        return;
      }
      const res = await fetch(`${API}/list-react-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: trimmed }),
      });
      const data = await res.json();
      if (data.files && data.repo_id) {
        setRepoFiles(data.files);
        setRepoId(data.repo_id);
      } else {
        setError("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const migrateRepo = async () => {
    if (!repoId) return;
    setLoading(true);
    setDownloadUrl("");
    setError("");
    try {
      const res = await fetch(`${API}/migrate-repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_id: repoId }),
      });
      const data = await res.json();
      if (data.download_url) {
        setDownloadUrl(`${API}${data.download_url}`);
      } else {
        setError("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen flex flex-col">
      <div className="flex justify-center mt-8 mb-4">
        <Link href="/">
          <button className="btn btn-outline px-6 py-2 text-lg">
            ← Single File Migration
          </button>
        </Link>
      </div>
      <div className="card p-6 mb-8 glass">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-2 text-[#c4b5fd]" htmlFor="repo-input">
              Paste a GitHub repository URL
            </label>
            <input
              id="repo-input"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,20,0.3)] focus:border-[#8b5cf6] outline-none transition"
              placeholder="Enter GitHub repo URL (e.g. https://github.com/user/repo)"
            />
          </div>
          <button
            onClick={fetchRepoFiles}
            disabled={loading}
            className="btn btn-primary px-4 py-2 mt-4 md:mt-0 md:ml-4"
          >
            {loading ? "Loading..." : "Fetch Files"}
          </button>
        </div>
        {error && <div className="text-red-400 mt-4">{error}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="card p-6 flex flex-col glass">
          <h2 className="text-lg font-semibold mb-3 flex items-center heading">
            <span className="inline-block w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span>
            Repository Files
          </h2>
          {repoFiles.length > 0 ? (
            <ul className="overflow-y-auto max-h-96 text-sm">
              {repoFiles.map((f) => (
                <li key={f} className="py-1 border-b border-[rgba(255,255,255,0.05)]">{f}</li>
              ))}
            </ul>
          ) : (
            <div className="text-[#c4b5fd]">No files loaded yet.</div>
          )}
        </div>
        <div className="card p-6 flex flex-col glass">
          <h2 className="text-lg font-semibold mb-3 flex items-center heading">
            <span className="inline-block w-3 h-3 rounded-full bg-[#d946ef] mr-2"></span>
            Next.js Migration
          </h2>
          {repoFiles.length > 0 && !downloadUrl && (
            <>
              <div className="text-sm text-[#c4b5fd] mb-4">
                Click below to migrate the entire repo to Next.js.
              </div>
              <button
                onClick={migrateRepo}
                disabled={loading}
                className="btn btn-primary px-4 py-2 mt-2 w-full"
              >
                {loading ? "Processing..." : "Migrate to Next.js"}
              </button>
            </>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              className="btn btn-primary px-4 py-2 mt-4 w-full text-center"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Migrated Repo
            </a>
          )}
        </div>
      </div>
    </main>
  );
} 