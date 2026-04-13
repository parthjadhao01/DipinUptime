"use client";

import { Button } from "@/components/ui/button";
import { Activity, Github } from "lucide-react";
import Link from "next/link";


export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">

                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        <span className="font-mono text-sm font-bold tracking-tight">
              DipinUptime
            </span>
                    </div>

                    <div className="flex items-center gap-2">

                        <Button variant="ghost" size="sm" asChild>
                            <Link href="https://github.com">
                                <Github className="h-4 w-4" />
                                GitHub
                            </Link>
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                            <Link href="/signin">Sign In</Link>
                        </Button>

                        <Button size="sm" asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>

                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">

                <h1 className="font-mono text-4xl font-bold">
                    Your site is down.
                    <br />
                    Do you know yet?
                </h1>

                <p className="mt-6 max-w-lg text-muted-foreground">
                    DipinUptime watches your services 24/7 and alerts you instantly.
                </p>

                <div className="mt-10 flex gap-3">
                    <Button size="lg" asChild>
                        <Link href="/signup">Start Monitoring</Link>
                    </Button>

                    <Button variant="outline" size="lg" asChild>
                        <Link href="https://github.com">
                            <Github className="h-4 w-4" />
                            View on GitHub
                        </Link>
                    </Button>
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-border">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">

          <span className="text-xs text-muted-foreground">
            © 2025 DipinUptime
          </span>

                    <div className="flex gap-4">
                        {["GitHub", "Twitter", "Privacy"].map((link) => (
                            <a key={link} href="#" className="text-xs text-muted-foreground hover:text-foreground">
                                {link}
                            </a>
                        ))}
                    </div>

                </div>
            </footer>
        </div>
    );
}