import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas";

const pool = new Pool({
    connectionString: process.env.DB_URL as string
})

export const db = drizzle(pool, {schema})