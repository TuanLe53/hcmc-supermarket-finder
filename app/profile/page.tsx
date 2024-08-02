import UpdateDialog from "@/components/updateDialog";
import { getUserByID, updateUserAddress, updateUsername } from "@/db/querys/user";
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

    async function updateName(newName: string) {
        "use server";
        await updateUsername(user?.id as string, newName)
        revalidatePath("/profile");
    }

    return (
        <main>
            <h1>Profile Page</h1>
            <div>
                <div className="flex flex-row">
                    <p>{user?.name}</p>
                    <UpdateDialog updateField={"username"} action={updateName}/>
                </div>
                <div className="flex flex-row">
                    <p>Address: {user?.address}</p>
                    <UpdateDialog updateField={"address"} action={updateAddress}/>
                </div>
            </div>
        </main>
    )
}