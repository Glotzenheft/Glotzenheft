import os
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

LICENSE_MARKER = "This file is part of Glotzenheft."

LICENSE_TEXT = f"""{LICENSE_MARKER}

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this programm.  If not, see <http://www.gnu.org/licenses/>."""

COMMENT_SYNTAX = {
    ".php": lambda t: "<?php\n/*\n" + t + "\n*/\n\n",
    ".js":  lambda t: "/*\n" + t + "\n*/\n\n",
    ".ts":  lambda t: "/*\n" + t + "\n*/\n\n",
    ".css": lambda t: "/*\n" + t + "\n*/\n\n",
    ".html": lambda t: "<!--\n" + t + "\n-->\n\n",
}

TARGET_EXTENSIONS = set(COMMENT_SYNTAX.keys())

def has_license(content: str) -> bool:
    return LICENSE_MARKER in content

def insert_header(ext: str, content: str) -> str:
    header = COMMENT_SYNTAX[ext](LICENSE_TEXT)

    if ext == ".php" and content.startswith("<?php"):
        rest = content[len("<?php"):].lstrip()
        return header + rest
    if ext == ".html":
        m = re.match(r"^\ufeff?\s*(<!DOCTYPE[^>]*>\s*)", content, flags=re.IGNORECASE)
        if m:
            insert_at = m.end()
            return content[:insert_at] + header + content[insert_at:]
        return header + content
    return header + content

def process_file(filepath: str, ext: str) -> bool:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if has_license(content):
        return False  # nichts zu tun

    new_content = insert_header(ext, content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True

def main():
    updated_files = 0
    print(f"Suche in Verzeichnis: {ROOT_DIR}")
    for root, _, files in os.walk(ROOT_DIR):
        for filename in files:
            _, ext = os.path.splitext(filename)
            if ext in TARGET_EXTENSIONS:
                full_path = os.path.join(root, filename)
                try:
                    if process_file(full_path, ext):
                        print(f"[+] Header eingefügt: {full_path}")
                        updated_files += 1
                except Exception as e:
                    print(f"[!] Fehler bei {full_path}: {e}")
    print(f"\nFertig. {updated_files} Dateien aktualisiert.")

if __name__ == "__main__":
    main()
