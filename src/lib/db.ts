import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // On Vercel, copy the SQLite DB to the writable /tmp folder
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const tmpPath = "/tmp/dev.db";

  if (!fs.existsSync(tmpPath)) {
    try {
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpPath);
      }
    } catch (e) {
      console.error("Could not copy DB to /tmp", e);
    }
  }

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:/tmp/dev.db"
      }
    }
  });
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export const db = prisma;
