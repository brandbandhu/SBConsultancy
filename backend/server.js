import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.env.UPLOAD_DIR || "backend/uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "SB Consultants Admin API" });
});

app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ message: error.message || "Request failed" });
});

app.listen(port, () => {
  console.log(`SB Consultants Admin API running on http://localhost:${port}`);
});
