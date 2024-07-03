import { db } from "@/db/db";
import { getWishlistItems } from "@/db/querys/wishlist";
import { WishList } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function TripDetail({ params }:{params:{id:string}}) {
    const wishlist = await db.query.WishList.findFirst({
        where: eq(WishList.id, params.id)
    })

    const items = await getWishlistItems(wishlist?.id as string);

    const fulfilledWishlist = async () => {
        "use server";
        await db.update(WishList).set({ status: "fulfilled", updatedAt: new Date() }).where(eq(WishList.id, wishlist?.id as string));
    
        revalidatePath(`/trips/${wishlist?.id}`);
    }

    return (
        <main>
            <p>{wishlist?.id}</p>
            <p>{wishlist?.status}</p>
            {wishlist?.status === "accepted" &&            
                <form action={fulfilledWishlist}>
                    <button type="submit">fulfilled</button>
                </form>
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