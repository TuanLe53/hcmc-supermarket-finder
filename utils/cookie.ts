import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export async function getAuthenticatedUserData() {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    try {
        const decode = await verifyJWT(token as string);
        return decode;
    } catch (error) {
        throw error
    }
}