import "./lib/error-capture";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { query } from "../backend/db.js";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
const jwtSecret = process.env.JWT_SECRET || "change-this-long-random-secret";

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;

  try {
    const payload = jwt.verify(token, jwtSecret) as { id: number };
    const admins = await query("SELECT id, name, email, role FROM admins WHERE id = ? AND is_active = 1 LIMIT 1", [
      payload.id,
    ]);
    return admins[0] || null;
  } catch {
    return null;
  }
}

async function handleAdminApi(request: Request) {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname === "/api/admin/login") {
    try {
      const { email, password } = await request.json();
      const admins = await query("SELECT * FROM admins WHERE email = ? AND is_active = 1 LIMIT 1", [email]);
      if (!admins.length) return json({ message: "Invalid email or password" }, 401);

      const admin = admins[0];
      const ok = await bcrypt.compare(password, admin.password_hash);
      if (!ok) return json({ message: "Invalid email or password" }, 401);

      const token = jwt.sign({ id: admin.id, role: admin.role }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      });

      return json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar_url: admin.avatar_url,
        },
      });
    } catch (error) {
      console.error(error);
      return json(
        {
          message: "Admin database is not ready. Start MySQL and import backend/schema.sql, then try again.",
        },
        500,
      );
    }
  }

  if (request.method === "GET" && url.pathname === "/api/admin/dashboard/stats") {
    const admin = await requireAdmin(request);
    if (!admin) return json({ message: "Unauthorized" }, 401);

    try {
      const [customers, apps, revenue, grs, books] = await Promise.all([
        query("SELECT COUNT(*) total FROM users"),
        query(`SELECT
          COUNT(*) total,
          SUM(status = 'Pending') pending,
          SUM(status = 'Approved') approved,
          SUM(status = 'Rejected') rejected,
          SUM(status = 'Completed') completed
          FROM applications`),
        query("SELECT COALESCE(SUM(amount),0) total FROM payments WHERE payment_status = 'paid'"),
        query("SELECT COUNT(*) total FROM gr_updates"),
        query("SELECT COUNT(*) total FROM pdf_books"),
      ]);

      return json({
        totalCustomers: customers[0].total,
        totalApplications: apps[0].total,
        pendingApplications: apps[0].pending || 0,
        approvedApplications: apps[0].approved || 0,
        rejectedApplications: apps[0].rejected || 0,
        completedApplications: apps[0].completed || 0,
        totalRevenue: revenue[0].total,
        uploadedGRs: grs[0].total,
        uploadedPDFBooks: books[0].total,
      });
    } catch (error) {
      console.error(error);
      return json({ message: "Could not load dashboard stats" }, 500);
    }
  }

  return json({ rows: [], total: 0, page: 1, limit: 10 });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/admin")) {
        return await handleAdminApi(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
