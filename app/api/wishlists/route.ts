import { createWishListWithItems } from "@/db/querys/wishlist";
import { WishlistItem } from "@/types";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { NextResponse } from "next/server";

interface Form{
    supermarket: string;
    items: WishlistItem[];
}

export async function POST(req: Request) {
    try {
        //GET user data from cookie
        const userData = await getAuthenticatedUserData();
        
        const body: Form = await req.json();
        
        await createWishListWithItems(userData?.id as string, Number(body.supermarket), body.items);

        return new NextResponse(JSON.stringify({ message: "Success" }), {
            status: 201
        });
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
            status: 500
        });
    }
}