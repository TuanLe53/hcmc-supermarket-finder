import { WishlistItem } from "@/types";
import { db } from "../db";
import { Item, Supermarket, User, WishList } from "../schemas";
import { and, eq, sql } from "drizzle-orm";

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
        supermarketID: Supermarket.id,
        status: WishList.status
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

export async function getUserTrips(userID: string) {
    return await db.select({
        id: WishList.id,
        ownerID: WishList.owner,
        owner: User.name,
        supermarket: Supermarket.name
    })
        .from(WishList)
        .leftJoin(User, eq(WishList.owner, User.id))
        .leftJoin(Supermarket, eq(Supermarket.id, WishList.supermarket))
        .where(eq(WishList.buyer, userID));
}

export async function getUserWishlists(userID: string) {
    return await db.select({
        id: WishList.id,
        status: WishList.status,
        supermarket: Supermarket.name,
        buyer: User.name,
        createdAt: WishList.createAt,
        updatedAt: WishList.updatedAt
    })
        .from(WishList)
        .leftJoin(User, eq(WishList.buyer, User.id))
        .leftJoin(Supermarket, eq(WishList.supermarket, Supermarket.id))
        .where(eq(WishList.owner, userID));
}

export async function isWishlistExists(wishlistID: string) {
    return db.query.WishList.findFirst({
        where: eq(WishList.id, wishlistID)
    })
}

export async function deleteItemFromWishlist(
    wishlistID: string,
    name: string,
    quantity: string
) {
    try {
        await db.delete(Item)
            .where(and(
                eq(Item.name, name),
                eq(Item.quantity, quantity),
                eq(Item.wishlist, wishlistID)
            ));
    } catch (error) {
        throw error
    }
}