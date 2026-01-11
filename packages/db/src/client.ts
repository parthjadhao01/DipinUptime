import { PrismaClient } from "./generated/prisma/client.js"

// Prisma Driver Adapter for Postgres
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// Create a new Driver Adapter instance for PrismaPostgres
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please create a .env file with your database connection string."
  )
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
