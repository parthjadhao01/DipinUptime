import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { sendSuccess, sendError } from "../utils/response";
import { WebsiteStatus } from "@repo/db";

export const createWebsiteTick = async (req: Request, res: Response) => {
  try {
    const { websiteId, validatorId, status, latency } = req.body;

    if (!websiteId || !validatorId || !status || latency === undefined) {
      return sendError(
        res,
        "websiteId, validatorId, status, and latency are required",
        400
      );
    }

    // Validate status enum
    if (!Object.values(WebsiteStatus).includes(status)) {
      return sendError(
        res,
        `Status must be one of: ${Object.values(WebsiteStatus).join(", ")}`,
        400
      );
    }

    const tick = await prisma.websiteTicks.create({
      data: {
        websiteId,
        validatorId,
        status,
        latency,
      },
      include: {
        Website: true,
        Validator: true,
      },
    });

    return sendSuccess(res, tick, "Website tick created successfully", 201);
  } catch (error: any) {
    throw error;
  }
};

export const getWebsiteTicks = async (req: Request, res: Response) => {
  try {
    const { websiteId, validatorId } = req.query;

    const where: any = {};
    if (websiteId) where.websiteId = websiteId as string;
    if (validatorId) where.validatorId = validatorId as string;

    const ticks = await prisma.websiteTicks.findMany({
      where,
      include: {
        Website: true,
        Validator: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to latest 100 ticks
    });

    return sendSuccess(res, ticks);
  } catch (error: any) {
    throw error;
  }
};
