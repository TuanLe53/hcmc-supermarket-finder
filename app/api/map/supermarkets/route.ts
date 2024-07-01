import { getNearbySupermarkets } from "@/db/querys/map";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

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

        const nearbySupermarkets = await getNearbySupermarkets(long, lat, searchingRadius, limit);

        return new NextResponse(JSON.stringify({ supermarkets: nearbySupermarkets }), {
			status: 200
		});
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Error" }), {
            status: 500
        });
    }
}