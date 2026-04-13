"use client"

import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Node Mesh Canvas ── */
interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    phase: number;
    pulseSpeed: number;
}

function useNodeMesh(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let nodes: Node[] = [];
        const NODE_COUNT = 60;
        const CONNECTION_DIST = 140;
        const OPACITY = 0.15;

        function resize() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function init() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * rect.width,
                    y: Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: 1.5 + Math.random() * 1.5,
                    phase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.005 + Math.random() * 0.015,
                });
            }
        }

        function draw() {
            if (!canvas || !ctx) return;
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx.clearRect(0, 0, w, h);

            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                n.phase += n.pulseSpeed;
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * OPACITY;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            for (const n of nodes) {
                const pulse = 1 + Math.sin(n.phase) * 0.3;
                const r = n.radius * pulse;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${OPACITY + 0.05})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        const startTimeout = setTimeout(() => {
            resize();
            init();
            animId = requestAnimationFrame(draw);
        }, 50);

        const handleResize = () => { resize(); init(); };
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(startTimeout);
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", handleResize);
        };
    }, [canvasRef]);
}

/* ── Google G SVG ── */
const GoogleG = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
    </svg>
);

/* ── Sign In Page ── */
export default function SignInPage() {
    const { status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mobileCanvasRef = useRef<HTMLCanvasElement>(null);

    useNodeMesh(canvasRef);
    useNodeMesh(mobileCanvasRef);

    // If already signed in, redirect to register/dashboard
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    async function handleEmailSignIn() {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        // ✅ This is the key call — tells NextAuth to send magic link email
        const res = await signIn("email", {
            email,
            redirect: false,        // don't redirect automatically
            callbackUrl: "/dashboard", // where to go after clicking magic link
        });

        setLoading(false);

        if (res?.error) {
            setError("Failed to send email. Please try again.");
            return;
        }

        // Show success state — email sent
        setSent(true);
    }

    if (status === "loading" || status === "authenticated") return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Left Panel — Desktop only */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
                <div className="relative z-10 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-foreground" />
                    <span className="font-mono text-sm font-bold tracking-tight text-foreground">
                        DipinUptime
                    </span>
                </div>
                <div className="relative z-10">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">
                        [ 847 NODES ACTIVE ]
                    </span>
                </div>
            </div>

            {/* Right Panel */}
            <div className="relative flex w-full lg:w-1/2 items-center justify-center px-6 py-16">
                <canvas
                    ref={mobileCanvasRef}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                    className="lg:hidden"
                />

                <div className="relative z-10 w-full max-w-[360px] space-y-8">

                    {!sent ? (
                        <>
                            {/* Badge */}
                            <span className="inline-block border border-border px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                                Secure Access
                            </span>

                            {/* Heading */}
                            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
                                Sign in.
                            </h1>

                            {/* Subtext */}
                            <p className="text-sm text-muted-foreground">
                                Monitor your infrastructure. Own your uptime.
                            </p>

                            <div className="h-px w-full bg-border" />

                            {/* Email field */}
                            <div className="space-y-2">
                                <label className="font-mono text-xs text-muted-foreground">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                                    className="h-11 rounded-none border-border bg-secondary font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                                />
                                {error && (
                                    <p className="font-mono text-xs text-red-500">{error}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                onClick={handleEmailSignIn}
                                disabled={loading}
                                className="w-full h-11 rounded-none font-mono text-sm bg-foreground text-background hover:bg-foreground/90"
                            >
                                {loading ? "Sending link..." : "Continue with Email →"}
                            </Button>

                            {/* Fine print */}
                            <p className="text-[11px] text-muted-foreground/50 text-center">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                                {" "}and{" "}
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>.
                            </p>
                        </>
                    ) : (
                        /* ── Email sent state ── */
                        <>
                            <span className="inline-block border border-border px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                                Check your inbox
                            </span>

                            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
                                Link sent.
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                We sent a magic link to{" "}
                                <span className="text-foreground font-mono">{email}</span>.
                                Click it to sign in — no password needed.
                            </p>

                            <div className="h-px w-full bg-border" />

                            <p className="text-xs text-muted-foreground">
                                Wrong email?{" "}
                                <button
                                    onClick={() => { setSent(false); setEmail(""); }}
                                    className="text-foreground hover:underline font-mono"
                                >
                                    Try again
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}