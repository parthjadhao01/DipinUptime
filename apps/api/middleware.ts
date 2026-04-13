import { getToken } from "next-auth/jwt";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    user?: any;
}

const secret = process.env.NEXTAUTH_SECRET!;

export const authMiddleware = async (req: AuthRequest  , res : Response  , next : NextFunction ) => {
    try{
        console.log("authorization middleware")
        const authHeader = req.headers["authorization"];
        console.log(authHeader)
        if (!authHeader){
            return res.status(401).json("No token provided");
        }

        const parts = authHeader.split(" ");

        if (parts.length !=2 || parts[0] != "Bearer"){
            return res.status(401).json({
                message : "Invalid auth formate"
            })
        }

        const rawToken = parts[1];

        if (!rawToken || rawToken === "undefined"){
            return res.status(401).json({
                message : "No token provided"
            })
        }

        let parsedToken;

        try{
            console.log("Parsing the token")
            parsedToken = jwt.verify(rawToken,secret);
            console.log("Parsed JWT token : ",parsedToken)
        }catch(err){
            return res.status(400).json({
                message : "Malformed token error",
                error : err
            })
        }

        if (!parsedToken){
            return res.status(401).json({
                message : "Unauthorized"
            })
        }

        req.user = parsedToken;
        console.log("USER",parsedToken);

        next();
    }catch (error){
        console.error("Auth error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};