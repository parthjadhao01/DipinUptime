import Image from "next/image";
import {Header} from "@/components/landing-page/header";
import {Hero} from "@/components/landing-page/hero";
import {Stats} from "@/components/landing-page/stats";
import {Features} from "@/components/landing-page/features";
import {Footer} from "@/components/landing-page/footer";
import {Button} from "@/components/ui/button";
import { Activity, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <nav className="animate-nothing-nav fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-foreground pulse-dot" />
                        <span className="font-mono text-sm font-bold tracking-tight text-foreground">
              DipinUptime
            </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-sans text-muted-foreground hover:text-foreground hover:bg-secondary">
                            <Github className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button variant="outline" size="sm" className="font-sans text-foreground border-foreground/20 bg-transparent hover:bg-secondary" asChild>
                            <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button size="sm" className="font-sans bg-foreground text-background hover:bg-foreground/90">
                            Sign Up
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="dot-grid-bg flex min-h-screen flex-col items-center justify-center px-4 text-center">
                {/* Badge */}
                <div className="animate-nothing-badge mb-8">
          <span className="inline-block rounded-sm border border-foreground/20 px-3 py-1 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Uptime Monitoring
          </span>
                </div>

                {/* Heading */}
                <h1 className="animate-nothing-heading font-mono text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                    Your site is down.
                    <br />
                    Do you know yet<span className="cursor-blink"></span>
                </h1>

                {/* Subtext */}
                <p className="animate-nothing-sub mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                    DipinUptime watches your services 24/7 and alerts you the instant
                    something breaks. Simple. Fast. Reliable.
                </p>

                {/* CTAs */}
                <div className="animate-nothing-cta mt-10 flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="font-sans bg-foreground text-background hover:bg-foreground/90 rounded-sm px-8">
                        Start Monitoring
                    </Button>
                    <Button variant="outline" size="lg" className="font-sans text-foreground border-foreground/20 bg-transparent hover:bg-secondary rounded-sm px-8">
                        <Github className="h-4 w-4" />
                        View on GitHub
                    </Button>
                </div>

                {/* Muted note */}
                <p className="animate-nothing-cta mt-6 text-xs text-muted-foreground/60">
                    No credit card required · Free forever plan
                </p>
            </main>

            {/* Footer */}
            <footer className="border-t border-border">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
          <span className="font-mono text-xs text-muted-foreground">
            © 2025 DipinUptime
          </span>
                    <div className="flex gap-4">
                        {["GitHub", "Twitter", "Privacy"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
