import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";

export const testEndpoint = (req: Request, res: Response) => {
  return sendSuccess(res, {
    message: "API is working!",
    timestamp: new Date().toISOString(),
    status: "ok",
  });
};
