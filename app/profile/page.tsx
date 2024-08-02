import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateDialog from "@/components/updateDialog";
import { getUserByID, updateUserAddress, updateUsername } from "@/db/querys/user";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { revalidatePath } from "next/cache";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
        <main
            className="h-screen grid grid-rows-3 grid-flow-col gap-4"
        >
            <div className="row-span-3 bg-red-400">
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-transparent">
                        <AccountCircleIcon fontSize="large" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-row">
                    <p>{user?.name}</p>
                    <UpdateDialog updateField={"username"} action={updateName}/>
                </div>
                <div className="flex flex-row">
                    <p>Address: {user?.address}</p>
                    <UpdateDialog updateField={"address"} action={updateAddress}/>
                </div>
            </div>
            <div className="col-span-2 bg-sky-400">
                <p>wishlist</p>
            </div>
            <div className="col-span-2 bg-red-600">
                <p>trip</p>
            </div>
        </main>
    )
}