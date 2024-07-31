import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { db } from "@/db/db";
import { getSupermarketByID } from "@/db/querys/supermarket";
import { getWishlistItems } from "@/db/querys/wishlist";
import { WishList } from "@/db/schemas";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import {validate as isUUID} from "uuid";

import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ItemTable from "@/components/itemTable";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserByID } from "@/db/querys/user";

async function TripDetail({ params }: { params: { id: string } }) {
    //Check if param is uuid
    if (!isUUID(params.id)) {
        redirect("/error")
    }

    //Check if wishlist exists
    const wishlist = await db.query.WishList.findFirst({
        where: eq(WishList.id, params.id)
    })
    if (!wishlist) {
        return (
            <main>
                <p>Not Found</p>
            </main>
        )
    }

    //Check if req user is buyer
    const reqUser = await getAuthenticatedUserData(); 
    if (wishlist?.buyer !== reqUser?.id) {
        redirect("/unauthorized")
    }

    const owner = await getUserByID(wishlist.owner);

    const items = await getWishlistItems(wishlist.id);
    const supermarket = await getSupermarketByID(wishlist.supermarket);

    const fulfilledWishlist = async () => {
        "use server";
        await db.update(WishList).set({ status: "fulfilled", updatedAt: new Date() }).where(eq(WishList.id, wishlist?.id as string));
    
        revalidatePath(`/trips/${wishlist?.id}`);
    }

    const cancelWishlist = async () => {
        "use server";
        await db.update(WishList).set({ status: "pending", buyer: null, updatedAt: new Date() }).where(eq(WishList.id, wishlist?.id as string));
    
        redirect("/trips")
    }

    return (
        <main className="relative p-1 h-screen">
            <div className="absolute">
                <Link href={"/trips"} className="hover:underline">
                    <ArrowBackIosNew fontSize="small"/>
                    Trips
                </Link>
            </div>
            <div className="ml-36 mb-4 w-4/5 p-2 rounded-xl bg-slate-200">
                <h1><InfoIcon />Info</h1>
                <div className="flex flex-row space-x-28">
                    <p>ID: {wishlist.id}</p>
                    <p>Status: {wishlist.status}</p>
                    <p>Accepted at: {format(wishlist.updatedAt as Date, "dd/MM/yyyy")}</p>
                </div>
                {wishlist.status === "accepted" &&       
                    <div className="flex justify-end space-x-2">
                        <Dialog>
                            <DialogTrigger className="text-red-500 font-semibold">
                                Cancel
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Cancel Trip</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to cancel this trip?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                                        Close
                                    </DialogClose>
                                    <form action={cancelWishlist}>
                                        <button
                                            type="submit"
                                            className="p-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Yes
                                        </button>
                                    </form>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>    

                        <Dialog>
                            <DialogTrigger className="text-sky-500 font-semibold">
                                Fulfilled
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Fulfilled Wishlist</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you fulfilled this wishlist?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                                        Close
                                    </DialogClose>
                                    <form action={fulfilledWishlist}>
                                        <button
                                            type="submit"
                                            className="p-1 rounded-md bg-sky-500 hover:bg-sky-600 text-white"
                                        >
                                            Yes
                                        </button>
                                    </form>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>    
                    </div>    
                }
            </div>

            <div className="ml-36 mb-4 w-4/5 p-2 rounded-xl bg-slate-200">
                <h1><AccountCircleIcon />Owner</h1>
                <p>Name: {owner?.name}</p>
                <p>Email: {owner?.email}</p>
                <p>Address: {owner?.address}</p>
                <p>Phone: +098765431</p>
            </div>

            <div className="flex flex-row space-x-4 ml-36 w-4/5">
                <div className="w-1/2 p-2 h-fit rounded-xl bg-slate-200">
                    <Collapsible>
                        <div className="flex flex-row justify-between">
                            <h1><StoreIcon />Supermarket</h1>
                            <CollapsibleTrigger>
                                <ArrowDropDownIcon />
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <p>{supermarket[0].name}</p>
                            <p>Address: {supermarket[0].address}</p>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                <div className="w-1/2 p-2 h-fit rounded-xl bg-slate-200">
                    <Collapsible>
                        <div className="flex flex-row justify-between">
                            <h1><AssignmentIcon />Items</h1>
                            <CollapsibleTrigger>
                                <ArrowDropDownIcon />
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <ItemTable
                                items={items}
                                wishlistID={wishlist.id}
                                wishlistStatus={wishlist.status}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </main>
    )
};

export default TripDetail;