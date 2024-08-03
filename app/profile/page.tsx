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
            <div className="row-span-3 flex justify-center">
                <div className="h-52 w-3/5 mt-20 p-2 bg-slate-300 rounded-2xl">
                    <div className="flex flex-col items-center mb-1">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-transparent">
                                <AccountCircleIcon className="h-full w-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row gap-1 justify-between">
                            <p>{user?.name}</p>
                            <UpdateDialog updateField={"username"} action={updateName}/>
                        </div>
                    </div>
                    <div className="flex flex-row gap-1 mb-1">
                        <p>Email: {user?.email}</p>
                        {/* <UpdateDialog updateField={"address"} action={updateAddress}/> */}
                    </div>
                    
                    <div className="flex flex-row gap-1 mb-1">
                        <p>Phone number: 0987654321</p>
                        <UpdateDialog updateField={"address"} action={updateAddress}/>
                    </div>

                    <div className="flex flex-row gap-1 mb-1">
                        <p>Address: {user?.address}</p>
                        <UpdateDialog updateField={"address"} action={updateAddress}/>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <div className="max-h-60 overflow-y-auto">
                    <table className="w-full border-hidden">
                        <thead className="sticky top-0">
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>This is ID</td>
                                <td>This is status</td>
                            </tr>

                            <tr>
                                <td>This is ID</td>
                                <td>This is status</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-span-2">
                <div className="max-h-60 overflow-y-auto">
                    <table className="w-full border-hidden">
                        <thead className="sticky top-0">
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>This is ID</td>
                                <td>This is status</td>
                            </tr>

                            <tr>
                                <td>This is ID</td>
                                <td>This is status</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}