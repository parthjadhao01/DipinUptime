import "dotenv/config"
import express from "express";
import { prisma } from "@repo/db";
import {authMiddleware} from "./middleware";

const app = express();

app.use(express.json());

app.post("/api/v1/website",authMiddleware,async (req,res)=>{
    const userId = req.userId!;
    const {url} = req.body
    const data = await prisma.website.create({
        data : {
            userId,
            url
        }
    })
    res.json({
        id : data.id
    })
})

app.get("/api/v1//website/status",async (req,res)=>{
    const websiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId!;
    const data = await prisma.website.findFirst({
        where : {
            id : websiteId,
            userId : userId,
            disabled : false
        },
        include : {
            ticks : true
        }
    })

    res.json(data)
})

app.get("/api/v1/website",async (req,res)=>{
    const userId = req.userId!;
    const websites = await prisma.website.findMany({
        where : {
            userId : userId,
            disabled : false
        },
        include : {
            ticks : true
        }
    })
    res.json(websites)
})

app.delete("/api/v1/website/:id",async (req,res)=>{
    const websiteId = req.params.id! as unknown as string;
    const userId = req.userId!;

    await prisma.website.update({
        where : {
            id : websiteId,
            userId : userId
        },
        data : {
            disabled : true
        }
    })

})


app.listen(3001,()=>{
    console.log("Server running on port 3000");
});