import { db } from "@/db/db";
import { getWishlistItems } from "@/db/querys/wishlist";
import { WishList } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {validate as isUUID} from "uuid";

async function TripDetail({ params }: { params: { id: string } }) {
    if (!isUUID(params.id)) {
        redirect("/error")
    }

    const wishlist = await db.query.WishList.findFirst({
        where: eq(WishList.id, params.id)
    })

    const items = await getWishlistItems(wishlist?.id as string);

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
        <main>
            <p>{wishlist?.id}</p>
            <p>{wishlist?.status}</p>
            {wishlist?.status === "accepted" &&
            <>
                <form action={fulfilledWishlist}>
                    <button type="submit">fulfilled</button>
                </form>
                <form action={cancelWishlist}>
                    <button type="submit">Cancel</button>
                </form>
            </>     
            }

            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <p>{item.name} | {item.quantity}</p>
                    </li>
                ))}
            </ul>
        </main>
    )
};

export default TripDetail;