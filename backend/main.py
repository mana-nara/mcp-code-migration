from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, anthropic, pathlib

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

REPO_PATH = pathlib.Path(os.path.join(os.getcwd(), "../react-demo"))

client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

class CodeIn(BaseModel):
    code: str

class CodePair(BaseModel):
    react_code: str

@app.get("/fetch")
def fetch_file(file: str):
    target = REPO_PATH / file
    if not target.exists():
        return {"error": f"{file} not found"}
    return {"code": target.read_text()}

@app.post("/migrate")
def migrate(snippet: CodeIn):
    prompt = (
        "Convert the following plain React component to a Next.js 13+ component "
        "using the App Router and TypeScript. Use functional components, `use client` where needed, "
        "and assume the file is placed under `/app` in a Next.js project. Preserve all props and behavior.\n\n"
        "React code:\n```jsx\n" + snippet.code + "\n```"
    )
    resp = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1000,
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"convertedCode": resp.content[0].text.strip()}
