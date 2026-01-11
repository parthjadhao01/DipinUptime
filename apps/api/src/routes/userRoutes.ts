import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

export default router;
