interface XmlNode {
  tag: string;
  attributes: Record<string, string>;
  children: (XmlNode | string)[];
}

export function xmlToJson(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Empty XML input");
  const result = parseXmlDocument(trimmed);
  return JSON.stringify(result, null, 2);
}

function parseXmlDocument(xml: string): Record<string, unknown> {
  let pos = 0;

  // Skip XML declaration
  if (xml.startsWith("<?")) {
    pos = xml.indexOf("?>") + 2;
  }

  const node = parseElement();
  return nodeToJson(node);

  function skipWhitespace() {
    while (pos < xml.length && /\s/.test(xml[pos])) pos++;
  }

  function parseElement(): XmlNode {
    skipWhitespace();
    if (xml[pos] !== "<" || xml[pos + 1] === "/") {
      throw new Error(`Expected opening tag at position ${pos}`);
    }
    pos++; // skip <

    const tag = parseTagName();
    const attributes = parseAttributes();

    skipWhitespace();

    // Self-closing tag
    if (xml[pos] === "/" && xml[pos + 1] === ">") {
      pos += 2;
      return { tag, attributes, children: [] };
    }

    if (xml[pos] !== ">") throw new Error(`Expected > at position ${pos}`);
    pos++; // skip >

    const children = parseChildren(tag);

    return { tag, attributes, children };
  }

  function parseTagName(): string {
    const start = pos;
    while (pos < xml.length && /[a-zA-Z0-9_:\-.]/.test(xml[pos])) pos++;
    return xml.substring(start, pos);
  }

  function parseAttributes(): Record<string, string> {
    const attrs: Record<string, string> = {};
    while (pos < xml.length) {
      skipWhitespace();
      if (xml[pos] === ">" || xml[pos] === "/") break;
      const name = parseTagName();
      skipWhitespace();
      if (xml[pos] !== "=") throw new Error(`Expected = at position ${pos}`);
      pos++;
      skipWhitespace();
      const quote = xml[pos];
      if (quote !== '"' && quote !== "'") throw new Error(`Expected quote at position ${pos}`);
      pos++;
      const valStart = pos;
      while (pos < xml.length && xml[pos] !== quote) pos++;
      attrs[name] = xml.substring(valStart, pos);
      pos++; // skip closing quote
    }
    return attrs;
  }

  function parseChildren(parentTag: string): (XmlNode | string)[] {
    const children: (XmlNode | string)[] = [];
    while (pos < xml.length) {
      if (xml[pos] === "<") {
        if (xml[pos + 1] === "/") {
          // Closing tag
          pos += 2;
          const closingTag = parseTagName();
          skipWhitespace();
          if (xml[pos] !== ">") throw new Error(`Expected > at position ${pos}`);
          pos++;
          if (closingTag !== parentTag) {
            throw new Error(`Mismatched tags: expected </${parentTag}>, got </${closingTag}>`);
          }
          return children;
        }
        if (xml.substring(pos, pos + 4) === "<!--") {
          const end = xml.indexOf("-->", pos);
          if (end === -1) throw new Error("Unclosed comment");
          pos = end + 3;
          continue;
        }
        if (xml.substring(pos, pos + 9) === "<![CDATA[") {
          const end = xml.indexOf("]]>", pos);
          if (end === -1) throw new Error("Unclosed CDATA");
          children.push(xml.substring(pos + 9, end));
          pos = end + 3;
          continue;
        }
        children.push(parseElement());
      } else {
        const start = pos;
        while (pos < xml.length && xml[pos] !== "<") pos++;
        const text = xml.substring(start, pos).trim();
        if (text) children.push(decodeXmlEntities(text));
      }
    }
    return children;
  }
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function encodeXmlEntities(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nodeToJson(node: XmlNode): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const content: Record<string, unknown> = {};

  if (Object.keys(node.attributes).length > 0) {
    for (const [k, v] of Object.entries(node.attributes)) {
      content[`@${k}`] = v;
    }
  }

  const childElements = node.children.filter((c): c is XmlNode => typeof c !== "string");
  const textParts = node.children.filter((c): c is string => typeof c === "string");

  if (childElements.length === 0 && textParts.length > 0) {
    const text = textParts.join("");
    if (Object.keys(content).length > 0) {
      content["#text"] = text;
      result[node.tag] = content;
    } else {
      result[node.tag] = text;
    }
  } else if (childElements.length > 0) {
    const grouped: Record<string, unknown[]> = {};
    for (const child of childElements) {
      const childJson = nodeToJson(child);
      for (const [k, v] of Object.entries(childJson)) {
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(v);
      }
    }
    for (const [k, v] of Object.entries(grouped)) {
      content[k] = v.length === 1 ? v[0] : v;
    }
    result[node.tag] = content;
  } else {
    result[node.tag] = Object.keys(content).length > 0 ? content : null;
  }

  return result;
}

export function jsonToXml(input: string): string {
  const obj = JSON.parse(input);
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("JSON root must be an object");
  }
  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    throw new Error("JSON must have exactly one root element");
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonNodeToXml(keys[0], obj[keys[0]], 0);
}

function jsonNodeToXml(tag: string, value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);

  if (value === null || value === undefined) {
    return `${pad}<${tag} />\n`;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return `${pad}<${tag}>${encodeXmlEntities(String(value))}</${tag}>\n`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => jsonNodeToXml(tag, item, indent)).join("");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const attrs: string[] = [];
    const children: string[] = [];
    let textContent: string | null = null;

    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("@")) {
        attrs.push(`${k.slice(1)}="${encodeXmlEntities(String(v))}"`);
      } else if (k === "#text") {
        textContent = String(v);
      } else {
        children.push(jsonNodeToXml(k, v, indent + 1));
      }
    }

    const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

    if (children.length === 0 && textContent === null) {
      return `${pad}<${tag}${attrStr} />\n`;
    }

    if (textContent !== null && children.length === 0) {
      return `${pad}<${tag}${attrStr}>${encodeXmlEntities(textContent)}</${tag}>\n`;
    }

    return `${pad}<${tag}${attrStr}>\n${children.join("")}${pad}</${tag}>\n`;
  }

  return `${pad}<${tag}>${encodeXmlEntities(String(value))}</${tag}>\n`;
}
