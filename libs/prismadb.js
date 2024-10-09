import { PrismaClient } from "@prisma/client";


const client = globalThis.PrismaClient || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.PrismaClient = client;

export default client;