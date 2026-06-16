import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

const envPath = path.resolve("backend/.env");
dotenv.config({ path: envPath });

const schemaPath = path.resolve("backend/schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  multipleStatements: true,
});

try {
  await connection.query(schema);
  console.log("Database setup complete: SBConsultancy");
} finally {
  await connection.end();
}
