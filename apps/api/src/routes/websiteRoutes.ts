import { Router } from "express";
import {
  createWebsite,
  getWebsites,
  getWebsiteById,
  deleteWebsite,
  getWebsiteStatus,
} from "../controllers/websiteController";

const router = Router();

router.post("/", createWebsite);
router.get("/", getWebsites);
router.get("/:id", getWebsiteById);
router.get("/:id/status", getWebsiteStatus);
router.delete("/:id", deleteWebsite);

export default router;
