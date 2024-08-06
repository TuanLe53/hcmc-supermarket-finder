import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateDialog from "@/components/updateDialog";
import { getUserByID, updateUserAddress, updateUsername } from "@/db/querys/user";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { revalidatePath } from "next/cache";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

async function logout() {
    "use server";
    const cookieStore = cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    
    permanentRedirect("/auth/login")
}

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
            className="h-screen"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col md:flex-row items-center h-52 w-4/5 md:w-2/5 mt-10 p-2 bg-slate-300 rounded-2xl">
                    <div className="flex flex-col justify-center items-center w-1/4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-transparent">
                                <AccountCircleIcon sx={{fontSize: 80}}/>
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col justify-center w-4/5">
                        <div className="flex flex-row mb-1 justify-between">
                            <p>Name: {user?.name}</p>
                            <UpdateDialog updateField={"username"} action={updateName}/>
                        </div>
                        <div className="flex flex-row mb-1 justify-between">
                            <p>Email: {user?.email}</p>
                            {/* <UpdateDialog updateField={"address"} action={updateAddress}/> */}
                        </div>
                        <div className="flex flex-row mb-1 justify-between">
                            <p>Phone number: 0987654321</p>
                            <UpdateDialog updateField={"address"} action={updateAddress}/>
                        </div>

                        <div className="flex flex-row mb-1 justify-between">
                            <p>Address: {user?.address}</p>
                            <UpdateDialog updateField={"address"} action={updateAddress}/>
                        </div>
                    </div>
                </div>
            
                <div className="w-4/5 md:w-2/5 xl:grid xl:grid-cols-3 gap-5 flex flex-col">
                    <Link href={"/map"}  className="shadow-xl">
                         <button className="w-full xl:w-48 xl:h-48 flex items-center border border-black rounded-xl">
                            <MapIcon sx={{fontSize: 70}} />
                            <p>Map</p>
                        </button>
                    </Link>
                    <Link href={"/trips"} className="shadow-xl">
                        <button className="w-full xl:w-48 xl:h-48 flex items-center border border-black rounded-xl">
                            <ShoppingCartIcon sx={{ fontSize: 70 }} />
                            <p>Trips</p>
                        </button>
                    </Link>
                    <Link href={"/wishlists"} className="shadow-xl">
                        <button className="w-full xl:w-48 xl:h-48 flex items-center border border-black rounded-xl">
                            <AssignmentIcon sx={{ fontSize: 70 }} />
                            <p>Wishlists</p>
                        </button>
                    </Link>
                    <form action={logout} className="shadow-xl">
                        <button
                            className="w-full xl:w-48 xl:h-48 flex items-center border border-black rounded-xl"
                            type="submit"
                        >
                            <LogoutIcon sx={{ fontSize: 70 }} />
                            <p>Logout</p>
                        </button>
                    </form>
                </div>
                
            </div>
        </main>
    )
}