import { addItemToWishlist, deleteWishlistByID, getWishlistItems, isWishlistExists } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { validate as isUUID } from "uuid";
import { format } from "date-fns";
import { getSupermarketByID } from "@/db/querys/supermarket";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ItemTable from "@/components/itemTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddCircleIcon from '@mui/icons-material/AddCircle';


async function WishlistPage({ params }: { params: { id: string } }) {
    //Check if param is uuid
    if (!isUUID(params.id)) {
        redirect("/error")
    }

    //Check if wishlist exists
    const wishlist = await isWishlistExists(params.id);
    if (!wishlist) {
        return (
            <main>
                <p>Not found</p>
            </main>
        )
    }

    //Check if req user is wishlist's owner
    const userData = await getAuthenticatedUserData();
    if (wishlist.owner !== userData?.id) {
        redirect("/unauthorized")
    }

    const supermarket = await getSupermarketByID(wishlist.supermarket);
    const items = await getWishlistItems(wishlist.id);
    
    const deleteWishlist = async () => {
        "use server";
        deleteWishlistByID(wishlist.id);

        revalidatePath("/wishlists");
        redirect("/wishlists");
    }

    const addNewItem = async (formData: FormData) => {
        "use server";

        const name = formData.get("name");
        const quantity = formData.get("quantity");

        await addItemToWishlist(wishlist.id, name as string, quantity as string);

        revalidatePath(`/wishlists/${wishlist.id}`)
    }

    return (
        <main className="relative p-1 h-screen">
            <div
                className="absolute"
            >
                <Link
                    href={"/wishlists"}
                    className="hover:underline"
                >
                    <ArrowBackIosNewIcon />
                    Wishlists
                </Link>
            </div>
            <div
                className="ml-36 mb-4 w-4/5 border-2 border-red-300"
            >
                <h1><InfoIcon />Info</h1>
                <p>ID: {wishlist.id}</p>
                <p>Status: {wishlist.status}</p>
                <p>Created at: {format(wishlist.createAt as Date, "dd/MM/yyyy")}</p>
                <p>Updated at: {format(wishlist.updatedAt as Date, "dd/MM/yyyy")}</p>
                {wishlist.status === "pending" &&
                    <form action={deleteWishlist}>
                        <button type="submit">DELETE</button>
                    </form>
                }
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

                            {/* Add Item to wishlist */}
                            <Collapsible className="mt-1">
                                <div className="flex justify-end">
                                    <CollapsibleTrigger>
                                        <button
                                            className="p-1 rounded-md bg-sky-400 hover:bg-sky-500"
                                        >
                                            Add new item
                                        </button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent>
                                    <form
                                        action={addNewItem}
                                        className="flex flex-row items-end justify-between"
                                    >
                                        <div className="flex-grow">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Enter your product's name"
                                                required
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                placeholder="Please specify the quantity and unit"
                                                required
                                            />
                                        </div>
                                        <button type="submit">
                                            <AddCircleIcon
                                                fontSize="large"
                                                className="hover:cursor-pointer text-sky-400 hover:text-sky-600"
                                            />   
                                        </button>
                                    </form>
                                </CollapsibleContent>
                            </Collapsible>

                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>

        </main>
    )
}

export default WishlistPage;