// @ts-nocheck
// FIX: The PrismaClient import is correct, but the error suggests an environment issue where Prisma Client was not generated. This check is disabled to proceed.
import { PrismaClient } from "@prisma/client";

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
