import { describe, it, expect } from "vitest";
import {
  generateCreateTable,
  generateInsert,
  generateAlterAdd,
  generateSql,
  createEmptyColumn,
  getTypesForDialect,
  ColumnDef,
} from "./logic";

const sampleColumns: ColumnDef[] = [
  { name: "id", type: "INT", nullable: false, defaultValue: "", primaryKey: true },
  { name: "name", type: "VARCHAR(255)", nullable: false, defaultValue: "", primaryKey: false },
  { name: "email", type: "VARCHAR(255)", nullable: true, defaultValue: "NULL", primaryKey: false },
];

describe("sql-generator", () => {
  it("generates MySQL CREATE TABLE", () => {
    const sql = generateCreateTable("users", sampleColumns, "mysql");
    expect(sql).toContain("CREATE TABLE `users`");
    expect(sql).toContain("`id` INT NOT NULL");
    expect(sql).toContain("`name` VARCHAR(255) NOT NULL");
    expect(sql).toContain("DEFAULT NULL");
    expect(sql).toContain("PRIMARY KEY (`id`)");
  });

  it("generates PostgreSQL CREATE TABLE", () => {
    const sql = generateCreateTable("users", sampleColumns, "postgresql");
    expect(sql).toContain('CREATE TABLE "users"');
    expect(sql).toContain('"id" INT NOT NULL');
    expect(sql).toContain('PRIMARY KEY ("id")');
  });

  it("generates MySQL INSERT", () => {
    const sql = generateInsert("users", sampleColumns, "mysql");
    expect(sql).toContain("INSERT INTO `users`");
    expect(sql).toContain("VALUES (?, ?, ?)");
  });

  it("generates PostgreSQL INSERT with $n placeholders", () => {
    const sql = generateInsert("users", sampleColumns, "postgresql");
    expect(sql).toContain("VALUES ($1, $2, $3)");
  });

  it("generates ALTER TABLE ADD COLUMN", () => {
    const col: ColumnDef = { name: "age", type: "INT", nullable: true, defaultValue: "0", primaryKey: false };
    const sql = generateAlterAdd("users", [col], "mysql");
    expect(sql).toContain("ALTER TABLE `users` ADD COLUMN `age` INT DEFAULT 0");
  });

  it("throws on empty table name", () => {
    expect(() => generateCreateTable("", sampleColumns, "mysql")).toThrow();
  });

  it("throws on empty columns", () => {
    expect(() => generateCreateTable("users", [], "mysql")).toThrow();
  });

  it("throws on empty column name", () => {
    const cols: ColumnDef[] = [{ name: "", type: "INT", nullable: true, defaultValue: "", primaryKey: false }];
    expect(() => generateCreateTable("users", cols, "mysql")).toThrow();
  });

  it("generateSql dispatches correctly", () => {
    const sql = generateSql("users", sampleColumns, "mysql", "create");
    expect(sql).toContain("CREATE TABLE");
  });

  it("createEmptyColumn returns defaults", () => {
    const col = createEmptyColumn();
    expect(col.name).toBe("");
    expect(col.nullable).toBe(true);
    expect(col.primaryKey).toBe(false);
  });

  it("getTypesForDialect returns correct types", () => {
    expect(getTypesForDialect("mysql")).toContain("INT");
    expect(getTypesForDialect("postgresql")).toContain("SERIAL");
  });
});
