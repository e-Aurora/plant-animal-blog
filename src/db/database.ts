import Database from "better-sqlite3";
import { readFileSync } from "fs";
import path from "path";

const dbFile = path.join(process.cwd(), "blog.db");
const db = new Database(dbFile);

// Initialize tables if not created
const schema = readFileSync(path.join(process.cwd(), "src/db/schema.sql"), "utf8");
db.exec(schema);

export default db;
