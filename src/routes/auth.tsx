import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — SB Consultants" },
      { name: "description", content: "Customer login and registration for SB Consultants — coming soon." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <PageHero eyebrow={t("nav.login")} title="Customer login & registration" />
      <section className="section">
        <div className="container-page max-w-md">
          <Card className="border-border p-6 shadow-card sm:p-8">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t("auth.signin").split(" ")[0]}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signup").split(" ")[0]}</TabsTrigger>
              </TabsList>

              <div className="mt-5 flex items-start gap-2 rounded-lg border border-saffron/30 bg-saffron/10 p-3 text-xs text-foreground/80">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-saffron-foreground" />
                <p>{t("auth.phase2")}</p>
              </div>

              <TabsContent value="signin" className="mt-6 space-y-4">
                <Form onSubmit={() => toast.info("Customer dashboard launches in our next release.")} cta={t("auth.continue")} />
                <p className="text-center text-xs text-muted-foreground">
                  {t("auth.noAccount")} <Link to="/contact" className="text-secondary hover:text-primary">{t("nav.contact")}</Link>
                </p>
              </TabsContent>
              <TabsContent value="signup" className="mt-6 space-y-4">
                <Form onSubmit={() => toast.info("We'll notify you when registration opens.")} cta={t("auth.continue")} register />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

function Form({ onSubmit, cta, register }: { onSubmit: () => void; cta: string; register?: boolean }) {
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {register && (
        <div className="grid gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required />
        </div>
      )}
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email or phone</Label>
        <Input id="email" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="pwd">Password</Label>
        <Input id="pwd" type="password" required minLength={6} />
      </div>
      <Button type="submit" size="lg" className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90">{cta}</Button>
    </form>
  );
}
