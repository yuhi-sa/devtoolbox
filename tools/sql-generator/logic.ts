export type Dialect = "mysql" | "postgresql";

export interface ColumnDef {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string;
  primaryKey: boolean;
}

export type StatementType = "create" | "insert" | "alter-add";

const MYSQL_TYPES = [
  "INT",
  "BIGINT",
  "SMALLINT",
  "TINYINT",
  "FLOAT",
  "DOUBLE",
  "DECIMAL",
  "VARCHAR(255)",
  "TEXT",
  "LONGTEXT",
  "CHAR(1)",
  "DATE",
  "DATETIME",
  "TIMESTAMP",
  "BOOLEAN",
  "JSON",
  "BLOB",
] as const;

const PG_TYPES = [
  "INTEGER",
  "BIGINT",
  "SMALLINT",
  "REAL",
  "DOUBLE PRECISION",
  "NUMERIC",
  "VARCHAR(255)",
  "TEXT",
  "CHAR(1)",
  "DATE",
  "TIMESTAMP",
  "TIMESTAMPTZ",
  "BOOLEAN",
  "JSON",
  "JSONB",
  "UUID",
  "BYTEA",
  "SERIAL",
  "BIGSERIAL",
] as const;

export function getTypesForDialect(dialect: Dialect): readonly string[] {
  return dialect === "mysql" ? MYSQL_TYPES : PG_TYPES;
}

export function generateCreateTable(
  tableName: string,
  columns: ColumnDef[],
  dialect: Dialect
): string {
  if (!tableName.trim()) throw new Error("Table name is required.");
  if (columns.length === 0) throw new Error("At least one column is required.");

  const lines: string[] = [];
  const pks: string[] = [];

  for (const col of columns) {
    if (!col.name.trim()) throw new Error("Column name must not be empty.");
    let line = `  ${quoteId(col.name, dialect)} ${col.type}`;
    if (!col.nullable) line += " NOT NULL";
    if (col.defaultValue.trim()) {
      line += ` DEFAULT ${col.defaultValue}`;
    }
    lines.push(line);
    if (col.primaryKey) pks.push(quoteId(col.name, dialect));
  }

  if (pks.length > 0) {
    lines.push(`  PRIMARY KEY (${pks.join(", ")})`);
  }

  const q = quoteId(tableName, dialect);
  return `CREATE TABLE ${q} (\n${lines.join(",\n")}\n);`;
}

export function generateInsert(
  tableName: string,
  columns: ColumnDef[],
  dialect: Dialect
): string {
  if (!tableName.trim()) throw new Error("Table name is required.");
  if (columns.length === 0) throw new Error("At least one column is required.");

  const colNames = columns.map((c) => quoteId(c.name, dialect)).join(", ");
  const placeholders = columns.map(() => "?").join(", ");
  const q = quoteId(tableName, dialect);

  if (dialect === "postgresql") {
    const pgPlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    return `INSERT INTO ${q} (${colNames})\nVALUES (${pgPlaceholders});`;
  }

  return `INSERT INTO ${q} (${colNames})\nVALUES (${placeholders});`;
}

export function generateAlterAdd(
  tableName: string,
  columns: ColumnDef[],
  dialect: Dialect
): string {
  if (!tableName.trim()) throw new Error("Table name is required.");
  if (columns.length === 0) throw new Error("At least one column is required.");

  const q = quoteId(tableName, dialect);
  const statements = columns.map((col) => {
    let line = `ALTER TABLE ${q} ADD COLUMN ${quoteId(col.name, dialect)} ${col.type}`;
    if (!col.nullable) line += " NOT NULL";
    if (col.defaultValue.trim()) line += ` DEFAULT ${col.defaultValue}`;
    return line + ";";
  });

  return statements.join("\n");
}

function quoteId(name: string, dialect: Dialect): string {
  if (dialect === "mysql") return `\`${name}\``;
  return `"${name}"`;
}

export function generateSql(
  tableName: string,
  columns: ColumnDef[],
  dialect: Dialect,
  statementType: StatementType
): string {
  switch (statementType) {
    case "create":
      return generateCreateTable(tableName, columns, dialect);
    case "insert":
      return generateInsert(tableName, columns, dialect);
    case "alter-add":
      return generateAlterAdd(tableName, columns, dialect);
  }
}

export function createEmptyColumn(): ColumnDef {
  return {
    name: "",
    type: "VARCHAR(255)",
    nullable: true,
    defaultValue: "",
    primaryKey: false,
  };
}
