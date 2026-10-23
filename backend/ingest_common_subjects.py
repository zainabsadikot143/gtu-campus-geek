import os
import chromadb
from chromadb.utils import embedding_functions

# Reuse the same helper functions as the main ingestion script
from ingest_knowledge_base import (
    parse_filename, extract_text_from_pdf, chunk_text, CHROMA_DB_PATH,
)

# Folder that holds the PDFs shared by all branches
COMMON_FOLDER = "../Knowledge_Base/ALL branch common syllabus"

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_or_create_collection(
    name="gtu_syllabus", embedding_function=embedding_fn
)

print("Chunks in ChromaDB before:", collection.count())

files_done = 0
for filename in sorted(os.listdir(COMMON_FOLDER)):
    if not filename.lower().endswith(".pdf"):
        continue

    metadata = parse_filename(filename)
    if not metadata:
        print(f"SKIP (name format not recognised): {filename}")
        continue

    text = extract_text_from_pdf(os.path.join(COMMON_FOLDER, filename))
    chunks = chunk_text(text)
    ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]

    # upsert = add if new, overwrite if it already exists (no duplicates)
    collection.upsert(
        ids=ids,
        documents=chunks,
        metadatas=[metadata for _ in chunks],
    )
    files_done += 1
    print(f"OK  {filename} -> {len(chunks)} chunks")

print("Files processed:", files_done)
print("Chunks in ChromaDB after:", collection.count())