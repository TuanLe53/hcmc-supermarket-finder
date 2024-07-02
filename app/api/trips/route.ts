import { getUserTrips } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const userData = await getAuthenticatedUserData();
        const trips = await getUserTrips(userData?.id as string);

        return new NextResponse(JSON.stringify({ trips: trips }));
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
            status: 500
        });
    }

}