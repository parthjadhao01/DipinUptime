"use client"
import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {getSession, signOut} from "next-auth/react";
import { useSession } from "next-auth/react";
import axios from "axios";


function dashboard() {
    const { data: session, status } = useSession();
    const [urls,setUrls] = useState<string[]>([]);

    const fetchUrls = async () => {
        if (!session?.accessToken) return; // 👈 safety check

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/website`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            }
        )
        setUrls(response.data);
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchUrls();
        }
    }, [status, session])

    if (status === "loading"){
        // Todo : create a loding component and apply it here
        return <div>
            loading ....
        </div>
    }

    if (status === "unauthenticated") {
        // todo : create a Error compoent and apply it here
        return <p>Access Denied</p>
    }

    return (
        <div>
            <div>this is dashboard</div>
            <div>
                <p>Signed in as {session?.accessToken}</p>
            </div>
            <Button onClick={ async ()=>{
                console.log("clicked")
                await signOut({
                    callbackUrl: "/signin",
                })
                const session = await getSession()
                alert(`logged out successfully${session}`)

            }}>Log-out</Button>
            <div>
                {urls.toString()}
            </div>
        </div>
    )
}

export default dashboard
