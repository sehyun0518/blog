export interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]!.length as 2 | 3;
    const text = match[2]!.trim();
    headings.push({ level, text, id: headingToId(text) });
  }

  return headings;
}
