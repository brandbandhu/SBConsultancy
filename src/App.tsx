import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, usePath } from "@/lib/router";
import { services } from "@/lib/site-data";
import { HomePage } from "@/routes/index";
import { AboutPage } from "@/routes/about";
import { ServicesPage } from "@/routes/services";
import { ServiceDetailPage } from "@/routes/services.$slug";
import { GRPage } from "@/routes/gr-updates";
import { BooksPage } from "@/routes/pdf-books";
import { PricingPage } from "@/routes/pricing";
import { ContactPage } from "@/routes/contact";
import { AuthPage } from "@/routes/auth";
import { ApplyPage } from "@/routes/apply";
import { AdminPage } from "@/routes/admin";
import { Link } from "@/lib/router";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Routes() {
  const path = usePath();

  if (path === "/") return <HomePage />;
  if (path === "/about") return <AboutPage />;
  if (path === "/services") return <ServicesPage />;
  if (path.startsWith("/services/")) {
    const slug = decodeURIComponent(path.replace("/services/", ""));
    const service = services.find((item) => item.slug === slug);
    return service ? <ServiceDetailPage service={service} /> : <NotFoundPage />;
  }
  if (path === "/gr-updates") return <GRPage />;
  if (path === "/pdf-books") return <BooksPage />;
  if (path === "/pricing") return <PricingPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/auth") return <AuthPage />;
  if (path === "/apply") return <ApplyPage />;
  if (path === "/admin") return <AdminPage />;

  return <NotFoundPage />;
}

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider>
        <Routes />
        <Toaster richColors position="top-right" />
      </RouterProvider>
    </I18nProvider>
  );
}
