import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getApps, getGlobalContent } from "@/lib/content";
import { ArrowRight, FileText, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function Home() {
    const globalContent = getGlobalContent();
    const apps = await getApps();

    return (
        <div className="min-h-screen bg-[#1c1c1c] text-[#ededed] font-outfit selection:bg-white/10">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#2e2e2e] bg-[length:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#1c1c1c] via-transparent to-[#1c1c1c] z-0 pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2e2e2e] bg-[#232323]/50 text-[#888888] text-sm font-medium mb-6 backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-[#3ecf8e]" />
                        <span>Unified Legal Portal</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 uppercase">
                        Transparency <br /> Built for Trust.
                    </h1>

                    <p className="text-base text-[#888888] max-w-xl mx-auto leading-relaxed mb-8">
                        Access Terms of Service, Privacy Policies, and Compliance Data for our entire suite of applications in one secure location.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="rounded-xl h-12 px-8 bg-white text-black hover:bg-white/90 font-bold" asChild>
                            <a href="#apps">
                                View Applications <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-xl h-12 px-8 border-[#2e2e2e] bg-[#232323] text-white hover:bg-[#2e2e2e] font-bold" asChild>
                            <Link href="/admin">
                                Admin Access
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="prose prose-invert prose-lg max-w-none text-[#888888]">
                    <MarkdownRenderer content={globalContent.home} />
                </div>
            </section>

            {/* Apps Grid */}
            <section id="apps" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#232323]/30 border-t border-[#2e2e2e]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Our Ecosystem</h2>
                            <p className="text-[#888888] text-sm">Select an application to view its specific legal documents.</p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {apps.map((app) => (
                            <Link
                                key={app.slug}
                                href={`/${app.slug}`}
                                className="group"
                            >
                                <Card className="h-full bg-[#232323] border-[#2e2e2e] hover:border-gray-600 transition-all duration-300 shadow-xl overflow-hidden flex flex-col">
                                    <CardHeader className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg"
                                                style={{ backgroundColor: app.theme.primary }}
                                            >
                                                <span className="font-bold text-lg">{app.name.substring(0, 2)}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                    {app.name}
                                                </CardTitle>
                                                <span className="text-[10px] font-mono text-[#888888] uppercase tracking-[0.2em]">Product</span>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 pt-0 flex-grow">
                                        <p className="text-sm text-[#888888] leading-relaxed">
                                            Manage your terms, privacy data, and user rights for {app.name}.
                                            Full compliance documentation available.
                                        </p>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0 border-t border-[#2e2e2e] flex flex-col gap-3">
                                        <div className="mt-6 flex flex-col gap-2">
                                            <div className="flex items-center text-xs text-[#888888]">
                                                <Scale className="w-3 h-3 mr-2" /> Terms of Service
                                            </div>
                                            <div className="flex items-center text-xs text-[#888888]">
                                                <FileText className="w-3 h-3 mr-2" /> Privacy Policy
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs font-bold mt-2 text-primary group-hover:translate-x-1 transition-transform">
                                            EXPLORE DOCUMENTS <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#2e2e2e] py-16 px-8 text-center bg-[#1c1c1c]">
                <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
                    <div className="w-10 h-10 bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-[#3ecf8e]" />
                    </div>
                    <p className="text-sm text-[#888888]">
                        Unified Legal Platform &copy; {new Date().getFullYear()}
                    </p>
                    <div className="flex gap-8">
                        <Link href="/admin" className="text-xs text-[#888888] hover:text-[#3ecf8e] transition-colors uppercase tracking-widest font-bold">Admin Portal</Link>
                        <Link href="#" className="text-xs text-[#888888] hover:text-[#3ecf8e] transition-colors uppercase tracking-widest font-bold">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
