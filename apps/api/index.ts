import "dotenv/config"
import express from "express";
import { prisma } from "@repo/db";

const app = express();

// Middleware
app.use(express.json());

// Test endpoint - dummy API for testing
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    status: "ok"
  });
});

// Create website endpoint
app.post("/api/v1/website", async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const data = await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    });

    console.log("Created user:", data);
    res.json({
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.createdAt,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create user", message: error.message });
  }
});

// Get all websites/users
app.get("/api/v1/websites", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get website status
app.get("/api/v1/website/status", (req, res) => {
  res.json({
    status: "ok",
    message: "Website status endpoint",
  });
});

// Delete website
app.delete("/api/website", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});