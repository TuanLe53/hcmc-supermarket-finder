import { and, eq, not, sql } from "drizzle-orm";
import { db } from "../db";
import { Supermarket, User, WishList } from "../schemas";

export async function getNearbySupermarkets(
    long: string,
    lat: string,
    searchingRadius: string,
    limit: number
) {
    return await db.select({
        id: Supermarket.id,
        name: Supermarket.name,
        address: Supermarket.address,
        location: Supermarket.location
    })
        .from(Supermarket)
        .where(sql<string>`ST_DWITHIN(location, ST_MAKEPOINT(${long}, ${lat})::geography, ${searchingRadius}, true)`)
        .limit(limit)
}

export async function getNearbyWishlists(
    userID: string,
    long: string,
    lat: string,
    searchingRadius: string,
    limit: number
) {
    return await db.select({
        id: WishList.id,
        name: User.name,
        address: User.address,
        supermarket: Supermarket.name,
        location: User.location
    })
        .from(WishList)
        .leftJoin(Supermarket, eq(WishList.supermarket, Supermarket.id))
        .leftJoin(User, eq(WishList.owner, User.id))
        .where(and(
            eq(WishList.status, "pending"),
            sql<string>`ST_DWITHIN(account.location, ST_MAKEPOINT(${long}, ${lat})::geography, ${searchingRadius}, true)`,
            not(eq(WishList.owner, userID))
        ))
        .limit(limit)
};