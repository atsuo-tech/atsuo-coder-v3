import { PrismaClient } from "@prisma/w-auth/client";

const w_auth_db = new PrismaClient();

export default w_auth_db;
