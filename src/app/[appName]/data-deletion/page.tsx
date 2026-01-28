import { getAppBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { DeletionForm } from "@/components/DeletionForm";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ appName: string }>;
}

export default async function DataDeletionPage({ params }: PageProps) {
  const { appName } = await params;
  const app = await getAppBySlug(appName);

  if (!app) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground tracking-tight text-xl">Data Deletion</h2>
          <p className="text-muted-foreground text-md">Manage your data sovereignty and request deletion for <span className="text-primary font-medium">{app.name}</span>.</p>
          <Separator className="bg-[#2e2e2e]" />
      </div>

      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="pt-6 prose prose-invert max-w-none">
          <MarkdownRenderer content={app.pages.data_deletion} />
        </CardContent>
      </Card>

      <div className="pt-12">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground text-xl">Submit Request</h3>
                <p className="text-muted-foreground mt-2 text-md">Fill out the form below to initiate the deletion process.</p>
            </div>
            <DeletionForm appName={app.name} />
        </div>
      </div>
    </div>
  );
}
