export type Delimiter = "," | "\t" | ";";

export function csvToJson(csv: string, delimiter: Delimiter = ","): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 1) {
    throw new Error("CSV is empty.");
  }

  const headers = parseCsvLine(lines[0], delimiter);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line, delimiter);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = (values[i] ?? "").trim();
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}

export function jsonToCsv(json: string, delimiter: Delimiter = ","): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON must be a non-empty array of objects.");
  }

  const headers = Object.keys(data[0]);
  const headerLine = headers.map((h) => escapeCsvField(h, delimiter)).join(delimiter);
  const lines = data.map((row: Record<string, unknown>) =>
    headers.map((h) => escapeCsvField(String(row[h] ?? ""), delimiter)).join(delimiter)
  );

  return [headerLine, ...lines].join("\n");
}

function parseCsvLine(line: string, delimiter: Delimiter): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

function escapeCsvField(field: string, delimiter: Delimiter): string {
  if (field.includes(delimiter) || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
