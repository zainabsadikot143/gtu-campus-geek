import os
import chromadb
from chromadb.utils import embedding_functions

# Reuse the same helper functions as the main ingestion script
from ingest_knowledge_base import (
    parse_filename, extract_text_from_pdf, chunk_text,
    SYLLABUS_ROOT, CHROMA_DB_PATH,
)

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_or_create_collection(
    name="gtu_syllabus", embedding_function=embedding_fn
)

print("Chunks in ChromaDB before:", collection.count())

files_done = 0
for semester_folder in sorted(os.listdir(SYLLABUS_ROOT)):
    semester_path = os.path.join(SYLLABUS_ROOT, semester_folder)
    if not os.path.isdir(semester_path):
        continue

    for filename in sorted(os.listdir(semester_path)):
        if not filename.lower().endswith(".pdf"):
            continue

        metadata = parse_filename(filename)
        # Only the files shared by all branches (names start with "All_")
        if not metadata or metadata["branch"].lower() != "all":
            continue

        text = extract_text_from_pdf(os.path.join(semester_path, filename))
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