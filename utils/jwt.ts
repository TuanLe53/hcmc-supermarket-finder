export function getSecretKey():Uint8Array{
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error("SECRET KEY is not found")
    }

    return new TextEncoder().encode(SECRET_KEY);
}