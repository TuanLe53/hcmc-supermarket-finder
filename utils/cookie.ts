import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export async function getAuthenticatedUserData() {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    const decode = await verifyJWT(token as string);
    return decode;
}