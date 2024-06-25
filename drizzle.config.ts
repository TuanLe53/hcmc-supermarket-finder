import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schemas.ts",
    dbCredentials: {
        url: process.env.DB_URL as string
    },
    extensionsFilters: ["postgis"],
    out: "./db/migrations",
    verbose: true,
    strict: true
})