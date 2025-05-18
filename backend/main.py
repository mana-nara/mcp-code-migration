from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os, anthropic, pathlib, tempfile, shutil, zipfile, glob, uuid, time
from git import Repo

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

REPO_PATH = pathlib.Path(os.path.join(os.getcwd(), "../react-demo"))

client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

class CodeIn(BaseModel):
    code: str

class CodePair(BaseModel):
    react_code: str

class RepoIn(BaseModel):
    repo_url: str

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

    full_text = resp.content[0].text.strip()

    # extract only the content inside the first ``` block
    if "```" in full_text:
        parts = full_text.split("```")
        if len(parts) >= 3:
            raw_code_block = parts[1].strip()
            code_lines = raw_code_block.splitlines()

            # if first line is a language tag (eg tsx, jsx, etc), remove it
            if code_lines and code_lines[0].strip() in {"tsx", "jsx", "js", "ts"}:
                code_lines = code_lines[1:]

            clean_code = "\n".join(code_lines).strip()
            return {"convertedCode": clean_code}
        else:
            return {"convertedCode": full_text}
    else:
        return {"convertedCode": full_text}

@app.post("/list-react-files")
def list_react_files(payload: RepoIn):
    repo_url = payload.repo_url
    repo_id = str(uuid.uuid4())
    temp_dir = os.path.join(tempfile.gettempdir(), f"mcp_{repo_id}")
    repo_dir = os.path.join(temp_dir, "repo")
    os.makedirs(repo_dir, exist_ok=True)
    try:
        Repo.clone_from(repo_url, repo_dir, depth=1)
        patterns = ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
        files = []
        for pattern in patterns:
            files.extend(glob.glob(os.path.join(repo_dir, pattern), recursive=True))
        rel_files = [os.path.relpath(f, repo_dir) for f in files]
        return {"repo_id": repo_id, "files": rel_files}
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        return {"error": str(e)}

def delayed_cleanup(path, delay=60):
    time.sleep(delay)
    shutil.rmtree(path, ignore_errors=True)

@app.post("/migrate-repo")
def migrate_repo(payload: dict, background_tasks: BackgroundTasks):
    repo_id = payload.get("repo_id")
    if not repo_id:
        raise HTTPException(status_code=400, detail="repo_id required")
    temp_dir = os.path.join(tempfile.gettempdir(), f"mcp_{repo_id}")
    repo_dir = os.path.join(temp_dir, "repo")
    migrated_dir = os.path.join(temp_dir, "migrated")
    os.makedirs(migrated_dir, exist_ok=True)
    try:
        patterns = ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
        files = []
        for pattern in patterns:
            files.extend(glob.glob(os.path.join(repo_dir, pattern), recursive=True))
        print(f"Found {len(files)} files to migrate in {repo_dir}")
        migrated_files = []
        for file_path in files:
            try:
                print(f"Migrating {file_path}")
                with open(file_path, "r") as f:
                    code = f.read()
                prompt = (
                    "Convert the following plain React component to a Next.js 13+ component "
                    "using the App Router and TypeScript. Use functional components, `use client` where needed, "
                    "and assume the file is placed under `/app` in a Next.js project. Preserve all props and behavior.\n\n"
                    f"React code:\n```jsx\n{code}\n```"
                )
                resp = client.messages.create(
                    model="claude-3-7-sonnet-20250219",
                    max_tokens=1000,
                    temperature=0,
                    messages=[{"role": "user", "content": prompt}]
                )
                full_text = resp.content[0].text.strip()
                if "```" in full_text:
                    parts = full_text.split("```")
                    if len(parts) >= 3:
                        raw_code_block = parts[1].strip()
                        code_lines = raw_code_block.splitlines()
                        if code_lines and code_lines[0].strip() in {"tsx", "jsx", "js", "ts"}:
                            code_lines = code_lines[1:]
                        clean_code = "\n".join(code_lines).strip()
                    else:
                        clean_code = full_text
                else:
                    clean_code = full_text
                rel_path = os.path.relpath(file_path, repo_dir)
                out_path = os.path.join(migrated_dir, rel_path)
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, "w") as f:
                    f.write(clean_code)
                print(f"Writing migrated file to {out_path}")
                migrated_files.append(out_path)
            except Exception as e:
                print(f"Failed to migrate {file_path}: {e}")
        zip_path = os.path.join(temp_dir, "migrated.zip")
        print(f"Zipping migrated files to {zip_path}")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(migrated_dir):
                for file in files:
                    abs_path = os.path.join(root, file)
                    arcname = os.path.relpath(abs_path, migrated_dir)
                    zipf.write(abs_path, arcname)
        print(f"Migration complete, returning download link")
        background_tasks.add_task(delayed_cleanup, temp_dir, 60)
        return {"download_url": f"/download-zip?repo_id={repo_id}"}
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print(f"Migration failed: {e}")
        return {"error": str(e)}

@app.get("/download-zip")
def download_zip(repo_id: str):
    temp_dir = os.path.join(tempfile.gettempdir(), f"mcp_{repo_id}")
    zip_path = os.path.join(temp_dir, "migrated.zip")
    if not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="Zip not found")
    return FileResponse(zip_path, filename="migrated.zip")
