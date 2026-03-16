// "use client"
//
// import { useState } from "react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
//
// import { useEffect, useRef } from "react";
// import { Activity } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
//
// /* ── Node Mesh Canvas ── */
// interface Node {
//     x: number;
//     y: number;
//     vx: number;
//     vy: number;
//     radius: number;
//     phase: number;
//     pulseSpeed: number;
// }
//
// function useNodeMesh(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;
//
//         let animId: number;
//         let nodes: Node[] = [];
//         const NODE_COUNT = 60;
//         const CONNECTION_DIST = 140;
//         const OPACITY = 0.15;
//
//         function resize() {
//             if (!canvas) return;
//             canvas.width = canvas.offsetWidth * window.devicePixelRatio;
//             canvas.height = canvas.offsetHeight * window.devicePixelRatio;
//             ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
//         }
//
//         function init() {
//             if (!canvas) return;
//             nodes = [];
//             for (let i = 0; i < NODE_COUNT; i++) {
//                 nodes.push({
//                     x: Math.random() * canvas.offsetWidth,
//                     y: Math.random() * canvas.offsetHeight,
//                     vx: (Math.random() - 0.5) * 0.3,
//                     vy: (Math.random() - 0.5) * 0.3,
//                     radius: 1.5 + Math.random() * 1.5,
//                     phase: Math.random() * Math.PI * 2,
//                     pulseSpeed: 0.005 + Math.random() * 0.015,
//                 });
//             }
//         }
//
//         function draw(time: number) {
//             if (!canvas || !ctx) return;
//             const w = canvas.offsetWidth;
//             const h = canvas.offsetHeight;
//             ctx.clearRect(0, 0, w, h);
//
//             // Update positions
//             for (const n of nodes) {
//                 n.x += n.vx;
//                 n.y += n.vy;
//                 if (n.x < 0 || n.x > w) n.vx *= -1;
//                 if (n.y < 0 || n.y > h) n.vy *= -1;
//                 n.phase += n.pulseSpeed;
//             }
//
//             // Draw edges
//             for (let i = 0; i < nodes.length; i++) {
//                 for (let j = i + 1; j < nodes.length; j++) {
//                     const dx = nodes[i].x - nodes[j].x;
//                     const dy = nodes[i].y - nodes[j].y;
//                     const dist = Math.sqrt(dx * dx + dy * dy);
//                     if (dist < CONNECTION_DIST) {
//                         const alpha = (1 - dist / CONNECTION_DIST) * OPACITY;
//                         ctx.beginPath();
//                         ctx.moveTo(nodes[i].x, nodes[i].y);
//                         ctx.lineTo(nodes[j].x, nodes[j].y);
//                         ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
//                         ctx.lineWidth = 0.5;
//                         ctx.stroke();
//                     }
//                 }
//             }
//
//             // Draw nodes
//             for (const n of nodes) {
//                 const pulse = 1 + Math.sin(n.phase) * 0.3;
//                 const r = n.radius * pulse;
//                 ctx.beginPath();
//                 ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
//                 ctx.fillStyle = `rgba(255,255,255,${OPACITY + 0.05})`;
//                 ctx.fill();
//             }
//
//             animId = requestAnimationFrame(draw);
//         }
//
//         resize();
//         init();
//         animId = requestAnimationFrame(draw);
//
//         window.addEventListener("resize", () => {
//             resize();
//             init();
//         });
//
//         return () => {
//             cancelAnimationFrame(animId);
//             window.removeEventListener("resize", resize);
//         };
//     }, [canvasRef]);
// }
//
// /* ── Google G SVG ── */
// const GoogleG = () => (
//     <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
//         <path
//             d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
//             fill="#fff"
//         />
//         <path
//             d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             fill="#fff"
//         />
//         <path
//             d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             fill="#fff"
//         />
//         <path
//             d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             fill="#fff"
//         />
//     </svg>
// );
//
// export default function RegisterPage() {
//     const { data: session, status } = useSession()
//     const router = useRouter()
//
//     const [name, setName] = useState("")
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState("")
//
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
//     useNodeMesh(canvasRef);
//     useNodeMesh(mobileCanvasRef);
//
//     if (status === "loading") return null
//
//     // If not logged in → go to sign in
//     if (!session) {
//         router.push("/api/auth/signin")
//         return null
//     }
//
//     async function submit() {
//         if (!name.trim()) {
//             setError("Name is required")
//             return
//         }
//
//         setLoading(true)
//
//         const res = await fetch("/api/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name })
//         })
//
//         setLoading(false)
//
//         if (!res.ok) {
//             setError("Something went wrong")
//             return
//         }
//
//         router.push("/dashboard")
//     }
//
//
//
//     return (
//         <div className="min-h-screen bg-background text-foreground flex">
//             {/* Left Panel — Desktop only */}
//             <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 overflow-hidden">
//                 <canvas
//                     ref={canvasRef}
//                     className="absolute inset-0 w-full h-full"
//                 />
//                 {/* Logo */}
//                 <div className="relative z-10 flex items-center gap-2">
//                     <Activity className="h-5 w-5 text-foreground pulse-dot" />
//                     <span className="font-mono text-sm font-bold tracking-tight text-foreground">
//             DipinUptime
//           </span>
//                 </div>
//                 {/* Node stat */}
//                 <div className="relative z-10">
//           <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">
//             [ 847 NODES ACTIVE ]
//           </span>
//                 </div>
//             </div>
//
//             {/* Right Panel */}
//             <div className="relative flex w-full lg:w-1/2 items-center justify-center px-6 py-16">
//                 {/* Mobile mesh background */}
//                 <canvas
//                     ref={mobileCanvasRef}
//                     className="absolute inset-0 w-full h-full lg:hidden"
//                 />
//
//                 <div className="relative z-10 w-full max-w-[360px] space-y-8">
//                     {/* Badge */}
//                     <div className="signin-stagger" style={{ animationDelay: "0s" }}>
//             <span className="inline-block border border-border px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
//               Secure Access
//             </span>
//                     </div>
//
//                     {/* Heading */}
//                     <div className="signin-stagger" style={{ animationDelay: "0.1s" }}>
//                         <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
//                             Sign in.
//                         </h1>
//                     </div>
//
//                     {/* Subtext */}
//                     <div className="signin-stagger" style={{ animationDelay: "0.2s" }}>
//                         <p className="text-sm text-muted-foreground">
//                             Monitor your infrastructure. Own your uptime.
//                         </p>
//                     </div>
//
//                     {/* Divider */}
//                     <div
//                         className="signin-stagger h-px w-full bg-border"
//                         style={{ animationDelay: "0.3s" }}
//                     />
//
//                     {/* Google */}
//                     <div className="signin-stagger" style={{ animationDelay: "0.35s" }}>
//                         <Button
//                             variant="outline"
//                             className="w-full h-11 gap-3 rounded-none font-mono text-sm text-foreground border-border bg-transparent hover:border-foreground transition-colors"
//                         >
//                             <GoogleG />
//                             Continue with Google
//                         </Button>
//                     </div>
//
//                     {/* Or divider */}
//                     <div
//                         className="signin-stagger flex items-center gap-4"
//                         style={{ animationDelay: "0.4s" }}
//                     >
//                         <div className="h-px flex-1 bg-border" />
//                         <span className="font-mono text-xs text-muted-foreground">or</span>
//                         <div className="h-px flex-1 bg-border" />
//                     </div>
//
//                     {/* Email */}
//                     <div className="signin-stagger space-y-2" style={{ animationDelay: "0.45s" }}>
//                         <label className="font-mono text-xs text-muted-foreground">
//                             Email address
//                         </label>
//                         <Input
//                             type="email"
//                             placeholder="you@example.com"
//                             className="h-11 rounded-none border-border bg-secondary font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
//                         />
//                     </div>
//
//                     {/* Continue */}
//                     <div className="signin-stagger" style={{ animationDelay: "0.5s" }}>
//                         <Button className="w-full h-11 rounded-none font-mono text-sm bg-foreground text-background hover:bg-foreground/90 relative overflow-hidden group">
//                             <span className="relative z-10">Continue with Email →</span>
//                         </Button>
//                     </div>
//
//                     {/* Fine print */}
//                     <div className="signin-stagger space-y-4" style={{ animationDelay: "0.55s" }}>
//                         <p className="text-[11px] text-muted-foreground/50 text-center">
//                             By continuing, you agree to our{" "}
//                             <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
//                             {" "}and{" "}
//                             <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>.
//                         </p>
//                         <p className="text-xs text-center text-muted-foreground">
//                             Don't have an account?{" "}
//                             <Link href="/" className="text-foreground hover:underline">
//                                 Sign Up
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client"


import {useEffect, useRef, useState} from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

// import { Link } from "react-router-dom";

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
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function init() {
            if (!canvas) return;
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    x: Math.random() * canvas.offsetWidth,
                    y: Math.random() * canvas.offsetHeight,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: 1.5 + Math.random() * 1.5,
                    phase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.005 + Math.random() * 0.015,
                });
            }
        }

        function draw(time: number) {
            if (!canvas || !ctx) return;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            // Update positions
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                n.phase += n.pulseSpeed;
            }

            // Draw edges
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

            // Draw nodes
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

        resize();
        init();
        animId = requestAnimationFrame(draw);

        window.addEventListener("resize", () => {
            resize();
            init();
        });

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, [canvasRef]);
}

/* ── Google G SVG ── */
const GoogleG = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#fff"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#fff"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#fff"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#fff"
        />
    </svg>
);

/* ── Sign In Page ── */
const RegisterPage = () => {

    const { data: session, status } = useSession()
    const router = useRouter()
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
    useNodeMesh(canvasRef);
    useNodeMesh(mobileCanvasRef);

    if (status === "loading") return null

    // If not logged in → go to sign in
    if (!session) {
        router.push("/api/auth/signin")
        return null
    }

    async function submit() {
        if (!name.trim()) {
            setError("Name is required")
            return
        }

        setLoading(true)

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        })

        setLoading(false)

        if (!res.ok) {
            setError("Something went wrong")
            return
        }

        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Left Panel — Desktop only */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />
                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-foreground pulse-dot" />
                    <span className="font-mono text-sm font-bold tracking-tight text-foreground">
            DipinUptime
          </span>
                </div>
                {/* Node stat */}
                <div className="relative z-10">
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">
            [ 847 NODES ACTIVE ]
          </span>
                </div>
            </div>

            {/* Right Panel */}
            <div className="relative flex w-full lg:w-1/2 items-center justify-center px-6 py-16">
                {/* Mobile mesh background */}
                <canvas
                    ref={mobileCanvasRef}
                    className="absolute inset-0 w-full h-full lg:hidden"
                />

                <div className="relative z-10 w-full max-w-[360px] space-y-8">
                    {/* Badge */}
                    <div className="signin-stagger" style={{ animationDelay: "0s" }}>
            <span className="inline-block border border-border px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Secure Access
            </span>
                    </div>

                    {/* Heading */}
                    <div className="signin-stagger" style={{ animationDelay: "0.1s" }}>
                        <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
                            Sign in.
                        </h1>
                    </div>

                    {/* Subtext */}
                    <div className="signin-stagger" style={{ animationDelay: "0.2s" }}>
                        <p className="text-sm text-muted-foreground">
                            Monitor your infrastructure. Own your uptime.
                        </p>
                    </div>

                    {/* Divider */}
                    <div
                        className="signin-stagger h-px w-full bg-border"
                        style={{ animationDelay: "0.3s" }}
                    />

                    {/* Google */}
                    <div className="signin-stagger" style={{ animationDelay: "0.35s" }}>
                        <Button
                            variant="outline"
                            className="w-full h-11 gap-3 rounded-none font-mono text-sm text-foreground border-border bg-transparent hover:border-foreground transition-colors"
                        >
                            <GoogleG />
                            Continue with Google
                        </Button>
                    </div>

                    {/* Or divider */}
                    <div
                        className="signin-stagger flex items-center gap-4"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <div className="h-px flex-1 bg-border" />
                        <span className="font-mono text-xs text-muted-foreground">or</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Email */}
                    <div className="signin-stagger space-y-2" style={{ animationDelay: "0.45s" }}>
                        <label className="font-mono text-xs text-muted-foreground">
                            Email address
                        </label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 rounded-none border-border bg-secondary font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                        />
                    </div>

                    {/* Continue */}
                    <div className="signin-stagger" style={{ animationDelay: "0.5s" }}>
                        <Button className="w-full h-11 rounded-none font-mono text-sm bg-foreground text-background hover:bg-foreground/90 relative overflow-hidden group">
                            <span className="relative z-10">Continue with Email →</span>
                        </Button>
                    </div>

                    {/* Fine print */}
                    <div className="signin-stagger space-y-4" style={{ animationDelay: "0.55s" }}>
                        <p className="text-[11px] text-muted-foreground/50 text-center">
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                            {" "}and{" "}
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>.
                        </p>
                        <p className="text-xs text-center text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/" className="text-foreground hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
