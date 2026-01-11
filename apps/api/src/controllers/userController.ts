import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { sendSuccess, sendError } from "../utils/response";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, "Email is required", 400);
    }

    const user = await prisma.user.create({
      data: { email },
      include: { Website: true },
    });

    return sendSuccess(res, user, "User created successfully", 201);
  } catch (error: any) {
    throw error;
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { Website: true },
      orderBy: { email: "asc" },
    });

    return sendSuccess(res, users);
  } catch (error: any) {
    throw error;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { Website: true },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user);
  } catch (error: any) {
    throw error;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    return sendSuccess(res, null, "User deleted successfully");
  } catch (error: any) {
    throw error;
  }
};
