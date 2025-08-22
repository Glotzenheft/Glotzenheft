import os
import re

# Konfiguration
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ROOT_DIR = os.path.abspath(ROOT_DIR)
LICENSE_TEXT = """
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
""".strip()

# Kommentar-Syntax pro Dateityp
COMMENT_SYNTAX = {
    ".php": lambda t: "<?php\n/*\n" + t + "\n*/\n\n",
    ".js": lambda t: "/*\n" + t + "\n*/\n\n",
    ".ts": lambda t: "/*\n" + t + "\n*/\n\n",
    ".css": lambda t: "/*\n" + t + "\n*/\n\n",
    ".html": lambda t: "<!--\n" + t + "\n-->\n\n",
}

# Ziel-Dateiendungen
TARGET_EXTENSIONS = COMMENT_SYNTAX.keys()

def has_license(content):
    return "Glotzenheft is free software" in content

def process_file(filepath, ext):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if has_license(content):
        return False  # Lizenz schon vorhanden

    header = COMMENT_SYNTAX[ext](LICENSE_TEXT)

    if ext == ".php" and content.startswith("<?php"):
        # PHP-Special: "<?php" darf nur einmal am Anfang vorkommen
        content = content[len("<?php"):].lstrip()
        new_content = header + content
    else:
        new_content = header + content

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
                        print(f"[+] Updated: {full_path}")
                        updated_files += 1
                except Exception as e:
                    print(f"[!] Fehler bei Datei {full_path}: {e}")

    print(f"\nFertig. {updated_files} Dateien aktualisiert.")

if __name__ == "__main__":
    main()
