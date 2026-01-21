import React, {useEffect, useState} from 'react'
import {useAuth} from "@clerk/nextjs";
import axios from "axios"
import {API_BACKEND_URL} from "@/config";
import {clearInterval} from "node:timers";



interface Website{
    id : string;
    url : string;
    ticks : {
        id : string;
        createdAt : string;
        status : string;
        latency : number;
    }[]
}

function useWebsite() {
    const {getToken} = useAuth();
    const [website,setWebsite] = useState<Website | null>(null);

    async function refreshWebsite(){
        const token = await getToken();
        const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`,{
            headers : {
                Authorization : token
            }
        })
        setWebsite(response.data.websites)

    }

    useEffect(()=>{
        refreshWebsite();
        const interval = setInterval(()=>{
            refreshWebsite();
        },1000*60*1)

        return () => clearInterval(interval)
    },[])

    return website;
}

export default useWebsite
