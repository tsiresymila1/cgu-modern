import { getAppBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ appName: string }>;
}

export default async function AppPage({ params }: PageProps) {
  const { appName } = await params;
  const app = await getAppBySlug(appName);

  if (!app) {
    notFound();
  }

  return (
    <div className="space-y-16">
      <section className="prose prose-invert max-w-none">
        <MarkdownRenderer content={app.pages.home} />
      </section>

      <Card className="bg-[#232323] border-[#2e2e2e] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Support & Contact
          </CardTitle>
          <CardDescription>
            Have questions about {app.name}? Reach out to our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium" asChild>
            <a href={`mailto:tsiresymila@gmail.com`}>
                tsiresymila@gmail
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-8 sm:grid-cols-2 pt-12 border-t border-[#2e2e2e]">
        <Link href={`/${app.slug}/privacy-policy`} className="group">
          <Card className="h-full bg-transparent border-[#2e2e2e] hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">Privacy Policy</CardTitle>
              <CardDescription>Learn how we protect and manage your personal data.</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="flex items-center text-sm font-medium text-primary">
                Read Policy <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </CardFooter>
          </Card>
        </Link>

        <Link href={`/${app.slug}/data-deletion`} className="group">
          <Card className="h-full bg-transparent border-[#2e2e2e] hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors text-xl!">Data Deletion</CardTitle>
              <CardDescription className="text-md">Manage your data sovereignty and request deletion.</CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="flex items-center text-sm font-medium text-primary">
                Request Deletion <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
