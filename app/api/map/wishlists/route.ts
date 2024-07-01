import { getNearbyWishlists } from "@/db/querys/map";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const userData = await getAuthenticatedUserData();

        const requiredParams = ["long", "lat", "radius", "limit"];
		const missingParams = requiredParams.filter(param => !searchParams.has(param));
		if (missingParams.length > 0) {
            return new NextResponse(JSON.stringify({ error: `Missing required parameters: ${missingParams.join(", ")}` }), {
                status: 400
			});
        }
        
        const long = searchParams.get("long") as string;
        const lat = searchParams.get("lat") as string;
        const searchingRadius = searchParams.get("radius") as string;
        const limit = Number(searchParams.get("limit"));

        const nearbyWishlists = await getNearbyWishlists(userData?.id as string, long, lat, searchingRadius, limit);

        return new NextResponse(JSON.stringify({ wishlists: nearbyWishlists }), {
			status: 200
		});
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Error" }), {
            status: 500
        });
    }
}