import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, BookOpen, CreditCard, FileArchive, FileCheck2, FileText, Home,
  LogOut, Menu, Search, Settings, Upload, Users, X, IndianRupee, MessageSquare,
  CheckCircle2, XCircle, Clock, Edit, Trash2, Download, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import logoUrl from "@/assets/logo.png";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - SB Consultants" },
      { name: "description", content: "SB Consultants administration dashboard." },
    ],
  }),
  component: AdminPage,
});

const API = import.meta.env.VITE_ADMIN_API_URL || "/api/admin";

const menu = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "services", label: "Manage Services", icon: FileCheck2 },
  { key: "applications", label: "Service Applications", icon: FileText },
  { key: "documents", label: "Uploaded Documents", icon: Upload },
  { key: "books", label: "PDF Law Books", icon: BookOpen },
  { key: "gr", label: "GR Updates", icon: FileArchive },
  { key: "customers", label: "Customers", icon: Users },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "enquiries", label: "Contact Enquiries", icon: MessageSquare },
  { key: "pricing", label: "Pricing", icon: IndianRupee },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type MenuKey = (typeof menu)[number]["key"];
type Row = Record<string, any>;

function authHeaders() {
  const token = localStorage.getItem("sb_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path: string, options: RequestInit = {}) {
  const headers = options.body instanceof FormData
    ? authHeaders()
    : { "Content-Type": "application/json", ...authHeaders() };
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  } catch {
    throw new Error(`Admin API is not reachable at ${API}. Start it with npm run admin:api.`);
  }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Request failed");
  return res.json();
}

export function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("sb_admin_token") || "");
  const [admin, setAdmin] = useState<Row>(() => JSON.parse(localStorage.getItem("sb_admin") || "null"));
  const [active, setActive] = useState<MenuKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  if (!token) {
    return <AdminLogin onLogin={(nextToken, nextAdmin) => {
      localStorage.setItem("sb_admin_token", nextToken);
      localStorage.setItem("sb_admin", JSON.stringify(nextAdmin));
      setToken(nextToken);
      setAdmin(nextAdmin);
    }} />;
  }

  const ActiveIcon = menu.find((item) => item.key === active)?.icon || Home;

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#1F2937]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-[#0B3A66] text-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="SB Consultants" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-display text-sm font-semibold">SB Consultants</p>
              <p className="text-xs text-white/65">Admin Panel</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${active === item.key ? "bg-white text-[#0B3A66]" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#EAF2FF] text-[#1E5AA8]">
                <ActiveIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold">{menu.find((item) => item.key === active)?.label}</h1>
                <p className="hidden text-xs text-slate-500 sm:block">Manage government document services and customer operations.</p>
              </div>
            </div>
            <div className="relative hidden w-72 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search admin data" className="pl-9" />
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{admin?.name || "Admin"}</p>
              <p className="text-xs text-slate-500">{admin?.role || "admin"}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("sb_admin_token");
                localStorage.removeItem("sb_admin");
                setToken("");
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <AdminContent active={active} globalSearch={globalSearch} />
        </main>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (token: string, admin: Row) => void }) {
  const [email, setEmail] = useState("admin@sbconsultants.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api("/login", { method: "POST", body: JSON.stringify({ email, password }) });
      toast.success("Welcome back");
      onLogin(data.token, data.admin);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-[#F4F7FB] lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-[#0B3A66] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt="SB Consultants" className="h-14 w-14 object-contain" />
          <div>
            <h1 className="font-display text-2xl font-semibold">SB Consultants</h1>
            <p className="text-white/70">Government Document & E-Seva Admin</p>
          </div>
        </div>
        <div>
          <p className="max-w-xl font-display text-4xl font-semibold leading-tight">Secure operations dashboard for applications, documents, payments and GR updates.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-md bg-white/10 p-4">JWT protected</div>
            <div className="rounded-md bg-white/10 p-4">MySQL backed</div>
            <div className="rounded-md bg-white/10 p-4">Role based</div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-5">
        <Card className="w-full max-w-md border-slate-200 p-7 shadow-card">
          <img src={logoUrl} alt="SB Consultants" className="mx-auto h-16 w-16 object-contain" />
          <h2 className="mt-5 text-center font-display text-2xl font-semibold">Admin Login</h2>
          <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage SB Consultants.</p>
          <p className="mt-3 rounded-md bg-[#F4F7FB] px-3 py-2 text-center text-xs text-slate-500">
            API: {API}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="block text-sm font-medium">
              Password
              <Input className="mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="button" onClick={() => toast.info("Password reset endpoint is ready for email integration.")} className="text-sm font-medium text-[#1E5AA8]">
              Forgot password?
            </button>
            <Button disabled={loading} className="w-full bg-[#F59E0B] text-[#1F2937] hover:bg-[#F59E0B]/90">
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}

function AdminContent({ active, globalSearch }: { active: MenuKey; globalSearch: string }) {
  if (active === "dashboard") return <Dashboard />;
  if (active === "services") return <ServicesManager globalSearch={globalSearch} />;
  if (active === "applications") return <Applications />;
  if (active === "documents") return <Documents />;
  if (active === "books") return <FileManager title="PDF Law Books" endpoint="/pdf-books" type="book" />;
  if (active === "gr") return <FileManager title="GR Updates" endpoint="/gr-updates" type="gr" />;
  if (active === "customers") return <Customers />;
  if (active === "payments") return <SimpleTable title="Payments" endpoint="/payments" columns={["item_name", "amount", "payment_status", "transaction_id", "created_at"]} />;
  if (active === "enquiries") return <Enquiries />;
  if (active === "pricing") return <Pricing />;
  return <SettingsPanel />;
}

function Dashboard() {
  const [stats, setStats] = useState<Row | null>(null);
  useEffect(() => {
    api("/dashboard/stats").then(setStats).catch((e) => toast.error(e.message));
  }, []);

  const cards = [
    ["Total Customers", stats?.totalCustomers, Users, "#1E5AA8"],
    ["Total Applications", stats?.totalApplications, FileText, "#0B3A66"],
    ["Pending Applications", stats?.pendingApplications, Clock, "#F59E0B"],
    ["Approved Applications", stats?.approvedApplications, CheckCircle2, "#16A34A"],
    ["Rejected Applications", stats?.rejectedApplications, XCircle, "#DC2626"],
    ["Completed Applications", stats?.completedApplications, FileCheck2, "#16A34A"],
    ["Total Revenue", `₹${Number(stats?.totalRevenue || 0).toLocaleString("en-IN")}`, IndianRupee, "#0B3A66"],
    ["Uploaded GRs", stats?.uploadedGRs, FileArchive, "#1E5AA8"],
    ["Uploaded PDF Books", stats?.uploadedPDFBooks, BookOpen, "#1E5AA8"],
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, value, Icon, color]) => (
        <Card key={label} className="border-slate-200 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{value ?? "..."}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-md text-white" style={{ backgroundColor: color }}>
              <Icon className="h-6 w-6" />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ServicesManager({ globalSearch }: { globalSearch: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", processing_time: "", price: "", documents: "", status: "active" });

  const load = () => {
    setLoading(true);
    api(`/services?q=${encodeURIComponent(globalSearch)}`)
      .then((data) => setRows(data.rows || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [globalSearch]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, k === "documents" ? JSON.stringify(v.split("\n").filter(Boolean)) : v));
    try {
      await api("/services", { method: "POST", body });
      toast.success("Service added");
      setForm({ name: "", description: "", processing_time: "", price: "", documents: "", status: "active" });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save service");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <Card className="border-slate-200 p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Add New Service</h2>
        <form onSubmit={save} className="mt-4 space-y-3">
          <Input placeholder="Service name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <textarea className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Processing time" value={form.processing_time} onChange={(e) => setForm({ ...form, processing_time: e.target.value })} />
          <Input placeholder="Service price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <textarea className="min-h-28 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" placeholder="Required documents, one per line" value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })} />
          <select className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button className="w-full bg-[#0B3A66]">Save Service</Button>
        </form>
      </Card>
      <DataCard title="Services" loading={loading} rows={rows}>
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.id} className="border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold">{row.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{row.description}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{row.processing_time}</span>
                <span className="font-semibold text-[#1E5AA8]">₹{row.price}</span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {(row.documents || []).slice(0, 5).map((doc: Row) => <li key={doc.id}>• {doc.document_name}</li>)}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline"><Edit className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  if (!confirm("Delete this service?")) return;
                  await api(`/services/${row.id}`, { method: "DELETE" });
                  toast.success("Service deleted");
                  load();
                }}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </DataCard>
    </div>
  );
}

function Applications() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    api(`/applications${status ? `?status=${encodeURIComponent(status)}` : ""}`)
      .then((data) => setRows(data.rows || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);
  return (
    <DataCard
      title="Service Applications"
      loading={loading}
      rows={rows}
      actions={<div className="flex gap-2"><Filter value={status} onChange={setStatus} options={["", "Pending", "Under Review", "Approved", "Rejected", "Completed"]} /><Button asChild variant="outline"><a href={`${API}/applications/export`}><Download className="mr-1.5 h-4 w-4" /> Export</a></Button></div>}
    >
      <AdminTable columns={["application_no", "customer_name", "service_name", "phone", "payment_status", "status", "created_at"]} rows={rows} actions={(row) => (
        <div className="flex flex-wrap gap-1">
          <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5" /></Button>
          {["Approved", "Rejected", "Completed"].map((next) => (
            <Button key={next} size="sm" variant="outline" onClick={async () => {
              await api(`/applications/${row.id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) });
              toast.success(`Marked ${next}`);
              load();
            }}>{next}</Button>
          ))}
        </div>
      )} />
    </DataCard>
  );
}

function Documents() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("");
  const load = () => api(`/documents${status ? `?status=${status}` : ""}`).then((data) => setRows(data.rows || []));
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, [status]);
  return (
    <DataCard title="Uploaded Documents" rows={rows} actions={<Filter value={status} onChange={setStatus} options={["", "Pending", "Approved", "Rejected"]} />}>
      <AdminTable columns={["document_name", "file_name", "status", "uploaded_at"]} rows={rows} actions={(row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" asChild><a href={row.file_path} target="_blank" rel="noreferrer">Preview</a></Button>
          <Button size="sm" variant="outline" asChild><a href={row.file_path} download>Download</a></Button>
          {["Approved", "Rejected"].map((next) => (
            <Button key={next} size="sm" variant="outline" onClick={async () => {
              await api(`/documents/${row.id}`, { method: "PATCH", body: JSON.stringify({ status: next, rejection_reason: next === "Rejected" ? prompt("Rejection reason") : "" }) });
              toast.success("Document updated");
              load();
            }}>{next}</Button>
          ))}
        </div>
      )} />
    </DataCard>
  );
}

function FileManager({ title, endpoint, type }: { title: string; endpoint: string; type: "book" | "gr" }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>({ title: "", category: "", description: "", price: "", department: "", gr_date: "" });
  const load = () => api(endpoint).then((data) => setRows(data.rows || []));
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    try {
      await api(endpoint, { method: "POST", body });
      toast.success(`${title} item saved`);
      setForm({ title: "", category: "", description: "", price: "", department: "", gr_date: "" });
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <Card className="border-slate-200 p-5 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Upload {title}</h2>
        <form onSubmit={save} className="mt-4 space-y-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          {type === "book" ? <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /> : (
            <>
              <Input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              <Input type="date" value={form.gr_date} onChange={(e) => setForm({ ...form, gr_date: e.target.value })} />
            </>
          )}
          <textarea className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && setForm({ ...form, file: e.target.files[0] })} />
          <Button className="w-full bg-[#0B3A66]">Upload</Button>
        </form>
      </Card>
      <DataCard title={title} rows={rows}>
        <AdminTable columns={type === "book" ? ["title", "category", "price", "download_count", "status"] : ["title", "department", "category", "gr_date", "status"]} rows={rows} actions={(row) => (
          <div className="flex gap-1">
            <Button size="sm" variant="outline"><Edit className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant="outline" onClick={async () => {
              if (!confirm("Delete this record?")) return;
              await api(`${endpoint}/${row.id}`, { method: "DELETE" });
              toast.success("Deleted");
              load();
            }}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        )} />
      </DataCard>
    </div>
  );
}

function Customers() {
  return <SimpleTable title="Customers" endpoint="/customers" columns={["name", "email", "phone", "is_blocked", "created_at"]} />;
}

function Enquiries() {
  const [rows, setRows] = useState<Row[]>([]);
  const load = () => api("/enquiries").then((data) => setRows(data.rows || []));
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  return (
    <DataCard title="Contact Enquiries" rows={rows}>
      <AdminTable columns={["name", "phone", "email", "service_required", "message", "status", "created_at"]} rows={rows} actions={(row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={async () => { await api(`/enquiries/${row.id}`, { method: "PATCH", body: JSON.stringify({ status: row.status === "read" ? "unread" : "read" }) }); load(); }}>Read</Button>
          <Button size="sm" variant="outline" onClick={async () => { if (confirm("Delete enquiry?")) { await api(`/enquiries/${row.id}`, { method: "DELETE" }); load(); } }}><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      )} />
    </DataCard>
  );
}

function Pricing() {
  const [data, setData] = useState<Row>({ services: [], books: [] });
  useEffect(() => { api("/pricing").then(setData).catch((e) => toast.error(e.message)); }, []);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {["services", "books"].map((kind) => (
        <DataCard key={kind} title={kind === "services" ? "Service Prices" : "PDF Book Prices"} rows={data[kind] || []}>
          <div className="space-y-3">
            {(data[kind] || []).map((row: Row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3">
                <span className="text-sm font-medium">{row.name || row.title}</span>
                <Input className="w-32" type="number" defaultValue={row.price} onBlur={async (e) => {
                  await api("/pricing", { method: "PATCH", body: JSON.stringify({ type: kind === "books" ? "pdf_book" : "service", id: row.id, price: e.target.value }) });
                  toast.success("Price updated");
                }} />
              </div>
            ))}
          </div>
        </DataCard>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useState<Row>({});
  useEffect(() => { api("/settings").then(setSettings).catch((e) => toast.error(e.message)); }, []);
  const fields = ["business_name", "phone", "whatsapp", "email", "address", "social_links", "content_labels"];
  return (
    <Card className="max-w-3xl border-slate-200 p-5 shadow-soft">
      <h2 className="font-display text-lg font-semibold">Website Settings</h2>
      <form className="mt-4 space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        const body = new FormData(e.currentTarget);
        await api("/settings", { method: "PUT", body });
        toast.success("Settings updated");
      }}>
        {fields.map((field) => (
          <label key={field} className="block text-sm font-medium capitalize">
            {field.replaceAll("_", " ")}
            <Input name={field} className="mt-1" defaultValue={settings[field] || ""} />
          </label>
        ))}
        <label className="block text-sm font-medium">
          Website logo
          <Input name="logo" type="file" accept=".png,.jpg,.jpeg" className="mt-1" />
        </label>
        <Button className="bg-[#0B3A66]">Update Settings</Button>
      </form>
    </Card>
  );
}

function SimpleTable({ title, endpoint, columns }: { title: string; endpoint: string; columns: string[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api(endpoint).then((data) => setRows(data.rows || [])).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [endpoint]);
  return (
    <DataCard title={title} rows={rows} loading={loading}>
      <AdminTable columns={columns} rows={rows} />
    </DataCard>
  );
}

function DataCard({ title, rows, loading, actions, children }: { title: string; rows: Row[]; loading?: boolean; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">{rows.length} records</p>
        </div>
        {actions}
      </div>
      {loading ? <p className="py-10 text-center text-slate-500">Loading...</p> : rows.length ? children : <EmptyState />}
    </Card>
  );
}

function AdminTable({ columns, rows, actions }: { columns: string[]; rows: Row[]; actions?: (row: Row) => React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[#F4F7FB] text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((col) => <th key={col} className="px-3 py-3">{col.replaceAll("_", " ")}</th>)}
            {actions && <th className="px-3 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row.id} className="bg-white">
              {columns.map((col) => (
                <td key={col} className="max-w-64 truncate px-3 py-3">
                  {col.includes("status") ? <StatusBadge status={row[col]} /> : String(row[col] ?? "-")}
                </td>
              ))}
              {actions && <td className="px-3 py-3">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = useMemo(() => {
    if (["Approved", "Completed", "paid", "active", "read"].includes(status)) return "bg-green-50 text-[#16A34A]";
    if (["Rejected", "failed", "inactive"].includes(status)) return "bg-red-50 text-[#DC2626]";
    return "bg-amber-50 text-[#B45309]";
  }, [status]);
  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${color}`}>{status || "Pending"}</span>;
}

function Filter({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select className="h-10 rounded-md border border-input bg-white px-3 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => <option key={option || "all"} value={option}>{option || "All"}</option>)}
    </select>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-[#F4F7FB] px-4 py-12 text-center">
      <FileText className="mx-auto h-10 w-10 text-slate-400" />
      <p className="mt-3 font-medium">No records found</p>
      <p className="text-sm text-slate-500">New records will appear here once available.</p>
    </div>
  );
}
