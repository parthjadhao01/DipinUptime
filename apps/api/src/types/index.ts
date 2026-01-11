import { Request, Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response
) => Promise<void | Response>;
