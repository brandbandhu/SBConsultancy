import jwt from "jsonwebtoken";
import { query } from "../db.js";

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Missing auth token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "change-this-long-random-secret");
    const admins = await query(
      "SELECT id, name, email, role, is_active FROM admins WHERE id = ? LIMIT 1",
      [payload.id],
    );
    if (!admins.length || !admins[0].is_active) {
      return res.status(401).json({ message: "Invalid admin session" });
    }

    req.admin = admins[0];
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      return res.status(403).json({ message: "Insufficient permission" });
    }
    next();
  };
}
