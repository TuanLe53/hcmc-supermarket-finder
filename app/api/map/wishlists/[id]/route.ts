import { getSupermarketByID } from "@/db/querys/supermarket";
import { acceptWishlist, getWishlistByID, getWishlistItems } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: {params:{id:string}}) {
    try {
        const wishlist = await getWishlistByID(params.id);        
        if (wishlist.length === 0) {
            return new NextResponse(JSON.stringify({ error: "Wishlist not found" }), {
                status: 404
            });
        }
        (wishlist[0] as any).type = "wishlist";

        const supermarket = await getSupermarketByID(Number(wishlist[0].supermarketID));
        (supermarket[0] as any).type = "supermarket";

        const markers = [wishlist[0], supermarket[0]];

        const items = await getWishlistItems(wishlist[0].id);

        return new NextResponse(JSON.stringify({ markers, items}));

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
            status: 500
        });
    }
}

export async function PATCH(req: Request, {params}: {params:{id:string}}) {
    try {
        const userData = await getAuthenticatedUserData();

        const wishlist = await getWishlistByID(params.id);
        if (wishlist.length === 0) {
            return new NextResponse(JSON.stringify({ error: "Wishlist not found" }), {
                status: 404
            });
        }

        await acceptWishlist(wishlist[0].id, userData?.id as string);

        return new NextResponse(JSON.stringify({ message: "Success" }), {
            status: 200
        })

    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
            status: 500
        });
    }
}