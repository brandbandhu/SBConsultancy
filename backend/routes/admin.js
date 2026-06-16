import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query, transaction } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload, filePayload } from "../upload.js";

const router = express.Router();

const tableMap = {
  pdfBooks: "pdf_books",
  grUpdates: "gr_updates",
  payments: "payments",
  enquiries: "contact_enquiries",
};

function page(req) {
  const limit = Math.min(Number(req.query.limit || 10), 100);
  const offset = Math.max(Number(req.query.page || 1) - 1, 0) * limit;
  return { limit, offset };
}

async function list(table, req, where = "1=1", params = [], order = "id DESC") {
  const { limit, offset } = page(req);
  const rows = await query(`SELECT * FROM ${table} WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, [
    ...params,
    limit,
    offset,
  ]);
  const count = await query(`SELECT COUNT(*) total FROM ${table} WHERE ${where}`, params);
  return { rows, total: count[0].total, page: Number(req.query.page || 1), limit };
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admins = await query("SELECT * FROM admins WHERE email = ? AND is_active = 1 LIMIT 1", [email]);
  if (!admins.length) return res.status(401).json({ message: "Invalid email or password" });

  const admin = admins[0];
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET || "change-this-long-random-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  res.json({
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, avatar_url: admin.avatar_url },
  });
});

router.post("/forgot-password", async (_req, res) => {
  res.json({ message: "Password reset request recorded. Configure email delivery for production." });
});

router.get("/me", requireAdmin, (req, res) => res.json({ admin: req.admin }));

router.get("/dashboard/stats", requireAdmin, async (_req, res) => {
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
  res.json({
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
});

router.get("/services", requireAdmin, async (req, res) => {
  const q = `%${req.query.q || ""}%`;
  const data = await list("services", req, "(name LIKE ? OR description LIKE ?)", [q, q], "created_at DESC");
  const ids = data.rows.map((r) => r.id);
  const docs = ids.length
    ? await query("SELECT * FROM service_required_documents WHERE service_id IN (?) ORDER BY sort_order, id", [ids])
    : [];
  res.json({
    ...data,
    rows: data.rows.map((s) => ({ ...s, documents: docs.filter((d) => d.service_id === s.id) })),
  });
});

router.post("/services", requireAdmin, upload.single("image"), async (req, res) => {
  const payload = req.body;
  const docs = JSON.parse(payload.documents || "[]");
  const file = filePayload(req.file);
  const result = await transaction(async (conn) => {
    const [insert] = await conn.execute(
      "INSERT INTO services (name, description, processing_time, price, image_url, icon, status) VALUES (?,?,?,?,?,?,?)",
      [payload.name, payload.description, payload.processing_time, payload.price || 0, file.file_path || payload.image_url || null, payload.icon || null, payload.status || "active"],
    );
    for (let i = 0; i < docs.length; i += 1) {
      await conn.execute(
        "INSERT INTO service_required_documents (service_id, document_name, sort_order) VALUES (?,?,?)",
        [insert.insertId, docs[i], i],
      );
    }
    return insert;
  });
  res.status(201).json({ id: result.insertId });
});

router.put("/services/:id", requireAdmin, upload.single("image"), async (req, res) => {
  const payload = req.body;
  const docs = payload.documents ? JSON.parse(payload.documents) : undefined;
  const file = filePayload(req.file);
  await transaction(async (conn) => {
    await conn.execute(
      `UPDATE services SET name=?, description=?, processing_time=?, price=?, image_url=COALESCE(?, image_url), icon=?, status=? WHERE id=?`,
      [payload.name, payload.description, payload.processing_time, payload.price || 0, file.file_path || null, payload.icon || null, payload.status || "active", req.params.id],
    );
    if (docs) {
      await conn.execute("DELETE FROM service_required_documents WHERE service_id=?", [req.params.id]);
      for (let i = 0; i < docs.length; i += 1) {
        await conn.execute(
          "INSERT INTO service_required_documents (service_id, document_name, sort_order) VALUES (?,?,?)",
          [req.params.id, docs[i], i],
        );
      }
    }
  });
  res.json({ message: "Service updated" });
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM services WHERE id=?", [req.params.id]);
  res.json({ message: "Service deleted" });
});

router.get("/applications", requireAdmin, async (req, res) => {
  const filters = [];
  const params = [];
  if (req.query.status) {
    filters.push("a.status=?");
    params.push(req.query.status);
  }
  if (req.query.service_id) {
    filters.push("a.service_id=?");
    params.push(req.query.service_id);
  }
  if (req.query.date) {
    filters.push("DATE(a.created_at)=?");
    params.push(req.query.date);
  }
  const where = filters.length ? filters.join(" AND ") : "1=1";
  const { limit, offset } = page(req);
  const rows = await query(
    `SELECT a.*, s.name service_name FROM applications a LEFT JOIN services s ON s.id=a.service_id
     WHERE ${where} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const count = await query(`SELECT COUNT(*) total FROM applications a WHERE ${where}`, params);
  res.json({ rows, total: count[0].total, page: Number(req.query.page || 1), limit });
});

router.get("/applications/export", requireAdmin, async (req, res) => {
  const rows = await query(
    `SELECT a.application_no, a.customer_name, s.name service_name, a.phone, a.payment_status, a.status, a.created_at
     FROM applications a LEFT JOIN services s ON s.id=a.service_id ORDER BY a.created_at DESC`,
  );
  const csv = [
    "Application ID,Customer,Service,Phone,Payment Status,Application Status,Date",
    ...rows.map((r) =>
      [r.application_no, r.customer_name, r.service_name, r.phone, r.payment_status, r.status, r.created_at]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  res.header("content-type", "text/csv");
  res.attachment("applications.csv").send(csv);
});

router.get("/applications/:id", requireAdmin, async (req, res) => {
  const rows = await query(
    `SELECT a.*, s.name service_name, s.description service_description FROM applications a
     LEFT JOIN services s ON s.id=a.service_id WHERE a.id=?`,
    [req.params.id],
  );
  if (!rows.length) return res.status(404).json({ message: "Application not found" });
  const documents = await query("SELECT * FROM uploaded_documents WHERE application_id=? ORDER BY uploaded_at DESC", [req.params.id]);
  const finalDocuments = await query("SELECT * FROM final_documents WHERE application_id=? ORDER BY uploaded_at DESC", [req.params.id]);
  res.json({ application: rows[0], documents, finalDocuments });
});

router.patch("/applications/:id/status", requireAdmin, async (req, res) => {
  const { status, admin_remarks, correction_request } = req.body;
  await query("UPDATE applications SET status=?, admin_remarks=?, correction_request=? WHERE id=?", [
    status,
    admin_remarks || null,
    correction_request || null,
    req.params.id,
  ]);
  res.json({ message: "Application status updated" });
});

router.post("/applications/:id/final-document", requireAdmin, upload.single("file"), async (req, res) => {
  const file = filePayload(req.file);
  await query(
    "INSERT INTO final_documents (application_id, file_name, file_path, uploaded_by) VALUES (?,?,?,?)",
    [req.params.id, file.file_name, file.file_path, req.admin.id],
  );
  await query("UPDATE applications SET status='Completed' WHERE id=?", [req.params.id]);
  res.status(201).json({ message: "Final document uploaded" });
});

router.get("/documents", requireAdmin, async (req, res) => {
  const data = await list("uploaded_documents", req, req.query.status ? "status=?" : "1=1", req.query.status ? [req.query.status] : [], "uploaded_at DESC");
  res.json(data);
});

router.patch("/documents/:id", requireAdmin, async (req, res) => {
  await query("UPDATE uploaded_documents SET status=?, rejection_reason=? WHERE id=?", [
    req.body.status,
    req.body.rejection_reason || null,
    req.params.id,
  ]);
  res.json({ message: "Document updated" });
});

router.get("/customers", requireAdmin, async (req, res) => {
  const q = `%${req.query.q || ""}%`;
  res.json(await list("users", req, "(name LIKE ? OR email LIKE ? OR phone LIKE ?)", [q, q, q], "created_at DESC"));
});

router.get("/customers/:id", requireAdmin, async (req, res) => {
  const customers = await query("SELECT * FROM users WHERE id=?", [req.params.id]);
  if (!customers.length) return res.status(404).json({ message: "Customer not found" });
  const applications = await query("SELECT * FROM applications WHERE user_id=? ORDER BY created_at DESC", [req.params.id]);
  const documents = await query("SELECT * FROM uploaded_documents WHERE user_id=? ORDER BY uploaded_at DESC", [req.params.id]);
  res.json({ customer: customers[0], applications, documents });
});

router.patch("/customers/:id/block", requireAdmin, async (req, res) => {
  await query("UPDATE users SET is_blocked=? WHERE id=?", [req.body.is_blocked ? 1 : 0, req.params.id]);
  res.json({ message: "Customer status updated" });
});

router.get("/payments", requireAdmin, async (req, res) => {
  res.json(await list("payments", req, req.query.payment_status ? "payment_status=?" : "1=1", req.query.payment_status ? [req.query.payment_status] : [], "created_at DESC"));
});

router.get("/enquiries", requireAdmin, async (req, res) => {
  res.json(await list("contact_enquiries", req, req.query.status ? "status=?" : "1=1", req.query.status ? [req.query.status] : [], "created_at DESC"));
});

router.patch("/enquiries/:id", requireAdmin, async (req, res) => {
  await query("UPDATE contact_enquiries SET status=? WHERE id=?", [req.body.status, req.params.id]);
  res.json({ message: "Enquiry updated" });
});

router.delete("/enquiries/:id", requireAdmin, async (req, res) => {
  await query("DELETE FROM contact_enquiries WHERE id=?", [req.params.id]);
  res.json({ message: "Enquiry deleted" });
});

router.get("/pricing", requireAdmin, async (_req, res) => {
  const services = await query("SELECT id, name, price FROM services ORDER BY name");
  const books = await query("SELECT id, title, price FROM pdf_books ORDER BY title");
  res.json({ services, books });
});

router.patch("/pricing", requireAdmin, async (req, res) => {
  const { type, id, price } = req.body;
  const table = type === "pdf_book" ? "pdf_books" : "services";
  await query(`UPDATE ${table} SET price=? WHERE id=?`, [price, id]);
  res.json({ message: "Price updated" });
});

function fileCrud(kind, table) {
  router.get(`/${kind}`, requireAdmin, async (req, res) => {
    const filters = [];
    const params = [];
    if (req.query.category) {
      filters.push("category=?");
      params.push(req.query.category);
    }
    if (req.query.date && table === "gr_updates") {
      filters.push("gr_date=?");
      params.push(req.query.date);
    }
    res.json(await list(table, req, filters.length ? filters.join(" AND ") : "1=1", params, "created_at DESC"));
  });

  router.post(`/${kind}`, requireAdmin, upload.single("file"), async (req, res) => {
    const file = filePayload(req.file);
    if (table === "pdf_books") {
      const result = await query(
        "INSERT INTO pdf_books (title, category, description, price, file_name, file_path, paid_download, status) VALUES (?,?,?,?,?,?,?,?)",
        [req.body.title, req.body.category, req.body.description, req.body.price || 0, file.file_name, file.file_path, req.body.paid_download ? 1 : 0, req.body.status || "active"],
      );
      return res.status(201).json({ id: result.insertId });
    }
    const result = await query(
      "INSERT INTO gr_updates (title, department, category, gr_date, description, file_name, file_path, status) VALUES (?,?,?,?,?,?,?,?)",
      [req.body.title, req.body.department, req.body.category, req.body.gr_date, req.body.description, file.file_name, file.file_path, req.body.status || "active"],
    );
    res.status(201).json({ id: result.insertId });
  });

  router.put(`/${kind}/:id`, requireAdmin, upload.single("file"), async (req, res) => {
    const file = filePayload(req.file);
    if (table === "pdf_books") {
      await query(
        "UPDATE pdf_books SET title=?, category=?, description=?, price=?, file_name=COALESCE(?, file_name), file_path=COALESCE(?, file_path), paid_download=?, status=? WHERE id=?",
        [req.body.title, req.body.category, req.body.description, req.body.price || 0, file.file_name || null, file.file_path || null, req.body.paid_download ? 1 : 0, req.body.status || "active", req.params.id],
      );
    } else {
      await query(
        "UPDATE gr_updates SET title=?, department=?, category=?, gr_date=?, description=?, file_name=COALESCE(?, file_name), file_path=COALESCE(?, file_path), status=? WHERE id=?",
        [req.body.title, req.body.department, req.body.category, req.body.gr_date, req.body.description, file.file_name || null, file.file_path || null, req.body.status || "active", req.params.id],
      );
    }
    res.json({ message: "Record updated" });
  });

  router.delete(`/${kind}/:id`, requireAdmin, async (req, res) => {
    await query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
    res.json({ message: "Record deleted" });
  });
}

fileCrud("pdf-books", tableMap.pdfBooks);
fileCrud("gr-updates", tableMap.grUpdates);

router.get("/settings", requireAdmin, async (_req, res) => {
  const rows = await query("SELECT setting_key, setting_value FROM settings ORDER BY setting_key");
  res.json(Object.fromEntries(rows.map((r) => [r.setting_key, r.setting_value])));
});

router.put("/settings", requireAdmin, upload.single("logo"), async (req, res) => {
  const entries = { ...req.body };
  const file = filePayload(req.file);
  if (file.file_path) entries.logo_url = file.file_path;
  await transaction(async (conn) => {
    for (const [key, value] of Object.entries(entries)) {
      await conn.execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)",
        [key, typeof value === "string" ? value : JSON.stringify(value)],
      );
    }
  });
  res.json({ message: "Settings updated" });
});

export default router;
