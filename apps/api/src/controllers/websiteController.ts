import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { sendSuccess, sendError } from "../utils/response";

export const createWebsite = async (req: Request, res: Response) => {
  try {
    const { url, userId } = req.body;

    if (!url || !userId) {
      return sendError(res, "URL and userId are required", 400);
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const website = await prisma.website.create({
      data: { url, userId },
      include: { User: true, ticks: true },
    });

    return sendSuccess(res, website, "Website created successfully", 201);
  } catch (error: any) {
    throw error;
  }
};

export const getWebsites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const where = userId ? { userId: userId as string } : {};

    const websites = await prisma.website.findMany({
      where,
      include: {
        User: true,
        ticks: {
          orderBy: { createdAt: "desc" },
          take: 10, // Latest 10 ticks
        },
      },
      orderBy: { url: "asc" },
    });

    return sendSuccess(res, websites);
  } catch (error: any) {
    throw error;
  }
};

export const getWebsiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        User: true,
        ticks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!website) {
      return sendError(res, "Website not found", 404);
    }

    return sendSuccess(res, website);
  } catch (error: any) {
    throw error;
  }
};

export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.website.delete({
      where: { id },
    });

    return sendSuccess(res, null, "Website deleted successfully");
  } catch (error: any) {
    throw error;
  }
};

export const getWebsiteStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        ticks: {
          orderBy: { createdAt: "desc" },
          take: 1, // Latest tick
        },
      },
    });

    if (!website) {
      return sendError(res, "Website not found", 404);
    }

    const latestTick = website.ticks[0];
    const status = latestTick
      ? {
          status: latestTick.status,
          latency: latestTick.latency,
          lastChecked: latestTick.createdAt,
        }
      : { status: "Unknown", latency: null, lastChecked: null };

    return sendSuccess(res, { website, status });
  } catch (error: any) {
    throw error;
  }
};
