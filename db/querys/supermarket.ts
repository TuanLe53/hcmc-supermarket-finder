import { eq } from "drizzle-orm";
import { db } from "../db";
import { Supermarket } from "../schemas";

export async function getSupermarketByID(id: number) {
    return await db.select({
        id: Supermarket.id,
        name: Supermarket.name,
        address: Supermarket.address,
        location: Supermarket.location,
    })
        .from(Supermarket)
        .where(eq(Supermarket.id, id))
}