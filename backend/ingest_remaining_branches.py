import os
import re
import fitz  # PyMuPDF
import chromadb
from chromadb.utils import embedding_functions

# Only process these branches - the ones NOT already ingested
TARGET_BRANCHES = ["CHM", "CVL", "ME", "PL"]

SYLLABUS_ROOT = "../Knowledge_Base/Syllabus"
CHROMA_DB_PATH = "../chroma_db"


def parse_filename(filename):
    match = re.match(r'^([A-Za-z]+)_Sem(\d+)_(.+?)(_C)?(?:_Syllabus)?\.pdf$', filename, re.IGNORECASE)
    if not match:
        return None

    branch, semester, subject_raw, is_cd = match.groups()
    subject_name = subject_raw.replace('_', ' ').strip()
    category = "C to D" if is_cd else "Common"

    return {
        "branch": branch,
        "semester": int(semester),
        "subject_name": subject_name,
        "category": category
    }


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text


def chunk_text(text, chunk_size=1000, overlap=150):
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - overlap

    return [c for c in chunks if c]


if __name__ == "__main__":
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    embedding_fn = embedding_functions.DefaultEmbeddingFunction()
    collection = client.get_or_create_collection(
        name="gtu_syllabus",
        embedding_function=embedding_fn
    )

    total_chunks_added = 0
    files_processed = 0
    files_skipped = 0

    for semester_folder in os.listdir(SYLLABUS_ROOT):
        semester_path = os.path.join(SYLLABUS_ROOT, semester_folder)
        if not os.path.isdir(semester_path):
            continue

        for filename in os.listdir(semester_path):
            if not filename.endswith(".pdf"):
                continue

            metadata = parse_filename(filename)
            if not metadata or metadata["branch"] not in TARGET_BRANCHES:
                continue

            pdf_path = os.path.join(semester_path, filename)

            try:
                text = extract_text_from_pdf(pdf_path)
                chunks = chunk_text(text)
            except Exception as e:
                print(f"⚠️  Failed to process {filename}: {e}")
                files_skipped += 1
                continue

            ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]
            metadatas = [metadata for _ in chunks]

            collection.add(
                ids=ids,
                documents=chunks,
                metadatas=metadatas
            )

            total_chunks_added += len(chunks)
            files_processed += 1
            print(f"✅ {filename} → {len(chunks)} chunks")

    print(f"\n--- DONE ---")
    print(f"Files processed: {files_processed}")
    print(f"Files skipped:   {files_skipped}")
    print(f"Total chunks added: {total_chunks_added}")