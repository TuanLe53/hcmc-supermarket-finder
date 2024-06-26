import { JWTPayload, SignJWT, jwtVerify } from "jose";

export function getSecretKey():Uint8Array{
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error("SECRET KEY is not found")
    }

    return new TextEncoder().encode(SECRET_KEY);
}

export async function verifyJWT(token: string):Promise<JWTPayload|null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload
    } catch (error) {
        throw error
    }
}

export async function generateJWTToken(
    name: string,
    id: string,
    duration: string | number | Date
) {
    return await new SignJWT({
        username: name,
        id: id
    }).setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(duration)
        .sign(getSecretKey())
}