import os
import re
import sys
import json
import shutil
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

ROOT = os.path.abspath("..")
KB_ROOT = os.path.join(ROOT, "Knowledge_Base")
PUBLIC_DIR = os.path.join(ROOT, "frontend", "public", "syllabus")

# Without --copy the script only REPORTS. With --copy it copies missing PDFs.
DO_COPY = "--copy" in sys.argv

# Extra folders to search, given as:  --src "C:\some\folder"
extra_sources = [sys.argv[i + 1] for i, a in enumerate(sys.argv) if a == "--src" and i + 1 < len(sys.argv)]
search_roots = [KB_ROOT] + extra_sources


def clean_name(filename):
    """'IT_Sem1_Python_Programming_Syllabus (1).pdf' -> 'IT_Sem1_Python_Programming_Syllabus.pdf'"""
    return re.sub(r"\s*\(\d+\)(?=\.pdf$)", "", filename, flags=re.IGNORECASE)


sb = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
rows = sb.table("subjects").select("subject_name,branch,syllabus_pdf").execute().data

# Index every PDF in all search folders: lowercase cleaned name -> full path
kb_index = {}
for search_root in search_roots:
    for folder, _, files in os.walk(search_root):
        for f in files:
            if f.lower().endswith(".pdf"):
                kb_index.setdefault(clean_name(f).lower(), os.path.join(folder, f))

os.makedirs(PUBLIC_DIR, exist_ok=True)
already_in_public = {f.lower() for f in os.listdir(PUBLIC_DIR)}

wanted = set()
no_pdf_name = []
for r in rows:
    name = r["syllabus_pdf"]
    if not name:
        no_pdf_name.append(f'{r["branch"]} | {r["subject_name"]}')
    else:
        wanted.add(name.lower())

have = [n for n in wanted if n in already_in_public]
to_copy = [n for n in wanted if n not in already_in_public and n in kb_index]
missing = [n for n in wanted if n not in already_in_public and n not in kb_index]

if DO_COPY:
    for n in to_copy:
        # save under the cleaned (no "(1)") original-case file name
        target = clean_name(os.path.basename(kb_index[n]))
        shutil.copy2(kb_index[n], os.path.join(PUBLIC_DIR, target))

print("Searched in:", search_roots)
print("Subjects in database:               ", len(rows))
print("Distinct PDF names wanted:          ", len(wanted))
print("Already in frontend/public/syllabus:", len(have))
print(("COPIED now:                         " if DO_COPY else "Can be copied (run with --copy):    "), len(to_copy))
print("NOT FOUND anywhere:                 ", len(missing))
for n in sorted(missing):
    print("   missing ->", n)
print("Rows with no PDF name in database:  ", len(no_pdf_name))
for n in no_pdf_name:
    print("   no name ->", n)

# Write a list of the PDFs that really exist, so the website only shows real links
manifest = {f.lower(): f for f in os.listdir(PUBLIC_DIR) if f.lower().endswith(".pdf")}
with open(os.path.join(PUBLIC_DIR, "manifest.json"), "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=0)
print("Wrote manifest.json with", len(manifest), "PDFs")