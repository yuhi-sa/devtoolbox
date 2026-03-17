export function formatXml(input: string, indentSize: number = 2): string {
  if (!input.trim()) return "";
  const indent = " ".repeat(indentSize);

  // Normalize: put each tag on its own line
  let xml = input.trim();
  // Preserve CDATA sections by replacing temporarily
  const cdataBlocks: string[] = [];
  xml = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, (match) => {
    cdataBlocks.push(match);
    return `__CDATA_${cdataBlocks.length - 1}__`;
  });

  // Put tags on separate lines
  xml = xml.replace(/>\s*</g, ">\n<");

  const lines = xml.split("\n");
  let depth = 0;
  const result: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Restore CDATA blocks
    let processedLine = line;
    processedLine = processedLine.replace(/__CDATA_(\d+)__/g, (_, idx) => {
      return cdataBlocks[Number(idx)];
    });

    const isClosingTag = /^<\//.test(line);
    const isSelfClosing = /\/>$/.test(line);
    const isComment = /^<!--/.test(line);
    const isProlog = /^<\?/.test(line);
    const isCdata = /^<!\[CDATA\[/.test(processedLine);
    const isOpeningTag = /^<[a-zA-Z]/.test(line) && !isSelfClosing;

    if (isClosingTag) {
      depth = Math.max(0, depth - 1);
    }

    result.push(indent.repeat(depth) + processedLine);

    if (isOpeningTag && !isClosingTag && !isSelfClosing && !isComment && !isProlog && !isCdata) {
      // Check if the line also contains the closing tag (inline content)
      const tagMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9:-]*)/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        const closingTagRegex = new RegExp(`</${tagName}\\s*>$`);
        if (!closingTagRegex.test(line)) {
          depth++;
        }
      }
    }
  }

  return result.join("\n");
}

export function minifyXml(input: string): string {
  if (!input.trim()) return "";
  // Preserve CDATA
  const cdataBlocks: string[] = [];
  let xml = input.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, (match) => {
    cdataBlocks.push(match);
    return `__CDATA_${cdataBlocks.length - 1}__`;
  });

  // Remove comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, "");
  // Remove whitespace between tags
  xml = xml.replace(/>\s+</g, "><");
  // Collapse whitespace
  xml = xml.replace(/\s+/g, " ");

  // Restore CDATA
  xml = xml.replace(/__CDATA_(\d+)__/g, (_, idx) => cdataBlocks[Number(idx)]);

  return xml.trim();
}

export function validateXml(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) return { valid: true };

  // Remove CDATA, comments, and prolog
  let xml = input.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
  xml = xml.replace(/<!--[\s\S]*?-->/g, "");
  xml = xml.replace(/<\?[\s\S]*?\?>/g, "");

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)[^>]*\/?>/g;
  const stack: string[] = [];
  let match;

  while ((match = tagRegex.exec(xml)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.endsWith("/>")) {
      // Self-closing tag, ignore
      continue;
    }

    if (fullTag.startsWith("</")) {
      // Closing tag
      const last = stack.pop();
      if (last !== tagName) {
        return {
          valid: false,
          error: `Mismatched tag: expected closing tag for '${last || "nothing"}' but found '${tagName}'`,
        };
      }
    } else {
      // Opening tag
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    return { valid: false, error: `Unclosed tag: '${stack[stack.length - 1]}'` };
  }

  return { valid: true };
}
