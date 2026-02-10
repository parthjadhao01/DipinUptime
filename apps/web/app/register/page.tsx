"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-[360px]">
                <h1 className="text-2xl font-semibold mb-2">Complete your account</h1>
                <p className="text-gray-600 mb-6">
                    Welcome {session.user?.email}
                </p>

                <input
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded hover:opacity-90"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    )
}
