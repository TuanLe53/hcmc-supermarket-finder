import UpdateDialog from "@/components/updateDialog";
import { getUserByID, updateUserAddress } from "@/db/querys/user";
import { getAuthenticatedUserData } from "@/utils/cookie";

import { revalidatePath } from "next/cache";

export default async function ProfilePage(){
    const userFromToken = await getAuthenticatedUserData();

    const user = await getUserByID(userFromToken?.id as string);

    async function updateAddress(address: string) {
        "use server";
        await updateUserAddress(user?.id as string, address);
        revalidatePath("/profile")
    }

    return (
        <main>
            <h1>Profile Page</h1>
            <div>
                <p>{user?.name}</p>
                <div className="flex flex-row">
                    <p>Address: {user?.address}</p>
                    <UpdateDialog action={updateAddress}/>
                </div>
            </div>
        </main>
    )
}