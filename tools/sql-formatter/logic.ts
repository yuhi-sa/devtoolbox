const MAJOR_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "ON",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "UNION",
  "UNION ALL",
];

const SUB_KEYWORDS = ["AND", "OR"];

export function formatSQL(sql: string): string {
  if (!sql.trim()) return "";

  let formatted = sql.trim();

  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, " ");

  // Uppercase all SQL keywords
  const allKeywords = [...MAJOR_KEYWORDS, ...SUB_KEYWORDS];
  allKeywords.sort((a, b) => b.length - a.length); // longest first

  for (const keyword of allKeywords) {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, keyword);
  }

  // Add newlines before major clauses
  for (const keyword of MAJOR_KEYWORDS) {
    const regex = new RegExp(`\\s+${keyword.replace(/\s+/g, "\\s+")}\\b`, "g");
    formatted = formatted.replace(regex, `\n${keyword}`);
  }

  // Indent sub-keywords
  for (const keyword of SUB_KEYWORDS) {
    const regex = new RegExp(`\n${keyword}\\b`, "g");
    formatted = formatted.replace(regex, `\n  ${keyword}`);
    const regex2 = new RegExp(`\\s+${keyword}\\b`, "g");
    formatted = formatted.replace(regex2, `\n  ${keyword}`);
  }

  // Clean up: remove leading newline
  formatted = formatted.replace(/^\n+/, "");

  // Add semicolon at end if missing
  if (!formatted.trimEnd().endsWith(";")) {
    formatted = formatted.trimEnd() + ";";
  }

  return formatted;
}
