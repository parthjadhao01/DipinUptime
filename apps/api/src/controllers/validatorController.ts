import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { sendSuccess, sendError } from "../utils/response";

export const createValidator = async (req: Request, res: Response) => {
  try {
    const { publicKey, location, ip } = req.body;

    if (!publicKey || !location || !ip) {
      return sendError(res, "publicKey, location, and ip are required", 400);
    }

    const validator = await prisma.validator.create({
      data: { publicKey, location, ip },
      include: { ticks: true },
    });

    return sendSuccess(res, validator, "Validator created successfully", 201);
  } catch (error: any) {
    throw error;
  }
};

export const getValidators = async (req: Request, res: Response) => {
  try {
    const validators = await prisma.validator.findMany({
      include: { ticks: true },
      orderBy: { location: "asc" },
    });

    return sendSuccess(res, validators);
  } catch (error: any) {
    throw error;
  }
};

export const getValidatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validator = await prisma.validator.findUnique({
      where: { id },
      include: { ticks: true },
    });

    if (!validator) {
      return sendError(res, "Validator not found", 404);
    }

    return sendSuccess(res, validator);
  } catch (error: any) {
    throw error;
  }
};
