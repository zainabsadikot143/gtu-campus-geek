import chromadb
from chromadb.utils import embedding_functions

CHROMA_DB_PATH = "../chroma_db"

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
embedding_fn = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_collection(name="gtu_syllabus", embedding_function=embedding_fn)

# Filtered query: only search within IT, Semester 1, Python Programming
results = collection.query(
    query_texts=["Explain loops and conditional statements in Python"],
    n_results=3,
    where={
        "$and": [
            {"branch": "IT"},
            {"semester": 1},
            {"subject_name": "Python Programming"}
        ]
    }
)

for i, doc in enumerate(results["documents"][0]):
    meta = results["metadatas"][0][i]
    print(f"\nResult {i+1} — {meta['branch']} Sem{meta['semester']} — {meta['subject_name']} ({meta['category']})")
    print(doc[:300], "...")