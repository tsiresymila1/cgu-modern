import { getAppBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ appName: string }>;
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { appName } = await params;
  const app = await getAppBySlug(appName);

  if (!app) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">Privacy Policy</h2>
          <p className="text-muted-foreground text-lg">Legal information regarding your data in <span className="text-primary font-medium">{app.name}</span>.</p>
          <Separator className="bg-[#2e2e2e]" />
      </div>
      
      <Card className="bg-transparent border-[#2e2e2e] shadow-none">
        <CardContent className="pt-6 prose prose-invert max-w-none">
          <MarkdownRenderer content={app.pages.privacy_policy} />
        </CardContent>
      </Card>
      
      <div className="text-center pt-8">
        <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
