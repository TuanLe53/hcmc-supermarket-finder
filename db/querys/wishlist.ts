import { WishlistItem } from "@/types";
import { db } from "../db";
import { Item, Supermarket, User, WishList } from "../schemas";
import { eq, sql } from "drizzle-orm";

export async function createWishListWithItems(
    owner: string,
    supermarket: number,
    items: WishlistItem[]
) {
    try {
        await db.transaction(async (tx) => {
            const wishlist = await tx.insert(WishList).values({
                owner,
                supermarket
            }).returning({ wishlistID: WishList.id });

            items.forEach(async (item) => {
                await tx.insert(Item).values({
                    wishlist: wishlist[0].wishlistID,
                    name: item.name,
                    quantity: item.quantity
                })
            })
        })
    } catch (error) {
        throw error
    }
};

export async function getWishlistByID(id: string) {
    return await db.select({
        id: WishList.id,
        name: User.name,
        address: User.address,
        location: User.location,
        supermarketID: Supermarket.id
    })
        .from(WishList)
        .leftJoin(User, eq(WishList.owner, User.id))
        .leftJoin(Supermarket, eq(WishList.supermarket, Supermarket.id))
        .where(eq(WishList.id, id));
};

export async function getWishlistItems(id: string) {
    return await db.select({
        name: Item.name,
        quantity: Item.quantity
    })
        .from(Item)
        .where(eq(Item.wishlist, id))
};

export async function acceptWishlist(
    id: string,
    buyer: string,
) {
        await db.update(WishList)
            .set({
                status: "accepted",
                buyer: buyer,
                updatedAt: new Date()
            })
            .where(eq(WishList.id, id));
};