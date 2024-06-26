import { NextRequest, NextResponse } from "next/server";
import { generateJWTToken, verifyJWT } from "./utils/jwt";

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        const decodedAccessToken = await verifyJWT(accessToken);
        return NextResponse.next();
    } catch (error) {
        if (!refreshToken) {
            return NextResponse.redirect(new URL("/auth/login", req.url))
        }
        try {
            const decodedRefreshToken = await verifyJWT(refreshToken);
            const userID = decodedRefreshToken?.id as string;
            const username = decodedRefreshToken?.username as string;

            const newAccessToken = await generateJWTToken(username, userID, "600s");
            
            const res = NextResponse.next();
            res.cookies.set("accessToken", newAccessToken)

            return res;
        } catch (error) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }
}

export const config = {
    matcher: ["/", "/map"],
}