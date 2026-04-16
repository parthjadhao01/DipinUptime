import "dotenv/config"
import express from "express";
import {db} from "./config/db.ts"
import {authMiddleware} from "./middleware";
import cookieParser from 'cookie-parser';
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));



app.post("/api/v1/website",authMiddleware,async (req ,res)=>{
    const userId = req?.user?.id!;
    console.log(userId)
    console.log(req.body)
    const {url} = req.body
    const data = await db.website.create({
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
    const userId = req?.user?.id!;
    const data = await db.website.findFirst({
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

app.get("/api/v1/website",authMiddleware,async (req,res)=>{
    const userId = req?.user?.id!;
    const websites = await db.website.findMany({
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
    const userId = req?.user?.id!;

    await db.website.update({
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
    console.log("Server running on port 3001");
});