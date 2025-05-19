# MCP Code Migration

A AI-powered tool to convert React components to Next.js 13+ with TypeScript, powered by FastAPI, Claude API, and a modern Next.js frontend.

---

### Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 18+ and npm** (for frontend)
- **Claude API key** (from Anthropic)

---

### 1. Clone the Repository

```bash
git clone https://github.com/mana-nara/mcp-code-migration.git
cd mcp-code-migration
```

---

### 2. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" anthropic fastapi-cors mcp-server-git
```

**Set your Claude API key (replace with your actual key):**
```bash
export CLAUDE_API_KEY="sk-ant-..."
```

**Start the backend server:**
```bash
uvicorn main:app --reload
```
- The API will be available at [http://localhost:8000](http://localhost:8000)
- API documentation and interactive testing interface is available at [http://localhost:8000/docs](http://localhost:8000/docs)
  - Use this to verify if the backend is working correctly and to test API endpoints directly

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

---

### 4. Using the App

1. Go to [http://localhost:3000](http://localhost:3000)
2. In the input box, enter `Hello.jsx` (already present in `react-demo/`).
3. Click **Fetch** to load the React code.
4. Click **Migrate** to convert it to a Next.js 13+ component with TypeScript.

---