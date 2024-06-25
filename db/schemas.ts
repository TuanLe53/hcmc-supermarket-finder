import { geometry, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("account", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password").notNull(),
    location: geometry("location", { type: "point" }).notNull(),
    address: text("address")
})