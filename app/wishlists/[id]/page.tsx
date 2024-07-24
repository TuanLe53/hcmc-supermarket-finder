import { db } from "@/db/db";
import { getWishlistItems, isWishlistExists } from "@/db/querys/wishlist";
import { WishList } from "@/db/schemas";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { validate as isUUID } from "uuid";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InfoIcon from '@mui/icons-material/Info';
import { format } from "date-fns";
import { getSupermarketByID } from "@/db/querys/supermarket";

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
        await db.delete(WishList).where(eq(WishList.id, wishlist.id));

        revalidatePath("/wishlists");
        redirect("/wishlists");
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
            <div
                className="ml-36 w-4/5 border-2 border-red-300"
            >
                <h1>Supermarket</h1>
                <p>{supermarket[0].name}</p>
                <p>Address: {supermarket[0].address}</p>
            </div>
        </main>
    )
}

export default WishlistPage;