import fs from "node:fs";
import path from "node:path";

const [, , inputPath, outputPath, title = "Document"] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/markdown-to-html.mjs <input.md> <output.html> [title]");
  process.exit(1);
}

const markdown = fs.readFileSync(inputPath, "utf8").replace(/\r\n/g, "\n");
const lines = markdown.split("\n");

let html = "";
let inList = false;
let inCode = false;
let paragraph = [];

function flushParagraph() {
  if (paragraph.length === 0) {
    return;
  }
  html += `<p>${paragraph.join(" ")}</p>\n`;
  paragraph = [];
}

function closeList() {
  if (inList) {
    html += "</ul>\n";
    inList = false;
  }
}

for (const rawLine of lines) {
  const line = rawLine.trimEnd();

  if (line.startsWith("```")) {
    flushParagraph();
    closeList();
    if (!inCode) {
      html += "<pre><code>";
      inCode = true;
    } else {
      html += "</code></pre>\n";
      inCode = false;
    }
    continue;
  }

  if (inCode) {
    html += `${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}\n`;
    continue;
  }

  if (!line.trim()) {
    flushParagraph();
    closeList();
    continue;
  }

  if (line.startsWith("### ")) {
    flushParagraph();
    closeList();
    html += `<h3>${line.slice(4)}</h3>\n`;
    continue;
  }

  if (line.startsWith("## ")) {
    flushParagraph();
    closeList();
    html += `<h2>${line.slice(3)}</h2>\n`;
    continue;
  }

  if (line.startsWith("# ")) {
    flushParagraph();
    closeList();
    html += `<h1>${line.slice(2)}</h1>\n`;
    continue;
  }

  if (line.startsWith("- ")) {
    flushParagraph();
    if (!inList) {
      html += "<ul>\n";
      inList = true;
    }
    html += `<li>${line.slice(2)}</li>\n`;
    continue;
  }

  paragraph.push(line);
}

flushParagraph();
closeList();

const document = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; margin: 40px; line-height: 1.5; color: #222; }
    h1, h2, h3 { color: #0f766e; }
    h1 { font-size: 28px; margin-bottom: 12px; }
    h2 { font-size: 22px; margin-top: 28px; }
    h3 { font-size: 18px; margin-top: 22px; }
    p, li { font-size: 12pt; }
    ul { margin-left: 20px; }
    pre { background: #f4f4f4; padding: 12px; border-radius: 8px; white-space: pre-wrap; }
    code { font-family: Menlo, monospace; }
    hr { margin: 24px 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, document);
