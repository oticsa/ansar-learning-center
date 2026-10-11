import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders 5-minute lesson content as clean formatted text.
 * Sanitizes paste artifacts: page-break chars, non-breaking spaces,
 * smart quotes, and table rows broken across lines.
 */
export function sanitizeLesson(raw: string): string {
  let text = raw
    .replace(/\r\n?/g, "\n")
    .replace(/[\f\v]/g, "\n") // form feed / vertical tab (page breaks)
    .replace(/ /g, " ") // non-breaking space
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/•/g, "- ")
    .replace(/\t/g, "  ");

  // Rejoin markdown table rows that were split across lines when pasted:
  // a line starting with "|" that doesn't end with "|" gets merged with the next line.
  const lines = text.split("\n");
  const merged: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (
      line.trimStart().startsWith("|") &&
      !line.trimEnd().endsWith("|") &&
      i + 1 < lines.length &&
      lines[i + 1].trim() !== ""
    ) {
      i++;
      line = line.trimEnd() + " " + lines[i].trimStart();
    }
    merged.push(line);
  }

  return merged.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function LessonViewer({ content }: { content: string }) {
  const clean = useMemo(() => sanitizeLesson(content), [content]);
  return (
    <article className="prose-console space-y-2 text-sm leading-relaxed text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{clean}</ReactMarkdown>
    </article>
  );
}
