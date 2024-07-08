import { sql } from "drizzle-orm";
import { doublePrecision, geometry, integer, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("account", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password").notNull(),
    location: geometry("location", { type: "point" }).notNull(),
    address: text("address")
})

export const Supermarket = pgTable("supermarket", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    location: geometry("location", { type: "point" }).notNull(),
    address: varchar("address"),
    district: varchar("district"),
    subdistrict: varchar("subdistrict")
});

export const WishList = pgTable("wishlist", {
    id: uuid("id").primaryKey().defaultRandom(),
    buyer: uuid("buyer_id").references(() => User.id),
    owner: uuid("owner_id").notNull().references(() => User.id),
    supermarket: integer("supermarket_id").notNull().references(() => Supermarket.id),
    status: text("status", {
        enum: ["pending", "accepted", "fulfilled"],
    }).notNull().default(sql<string>`'pending' CHECK (status IN ('pending', 'accepted', 'fulfilled'))`),
    createAt: timestamp("create_at").default(sql<string>`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql<string>`CURRENT_TIMESTAMP`)
});

export const Item = pgTable("wishlist_item", {
    wishlist: uuid("wishlist_id").notNull().references(() => WishList.id, {onDelete: "cascade"}),
    name: varchar("name", { length: 255 }).notNull(),
    quantity: varchar("quantity").notNull()
})