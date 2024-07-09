import { db } from "@/db/db";
import { WishList } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {validate as isUUID} from "uuid";

async function WishlistPage({ params }: { params: { id: string } }) {
    if (!isUUID(params.id)) {
        redirect("/error")
    }

    const query = await db.select().from(WishList).where(eq(WishList.id, params.id));
    if (query.length === 0) {
        return (
            <main>
                <p>Not found</p>
            </main>
        )
    }

    const wishlist = query[0];

    const deleteWishlist = async () => {
        "use server";
        await db.delete(WishList).where(eq(WishList.id, wishlist.id));

        revalidatePath("/wishlists");
        redirect("/wishlists");
    }

    return (
        <main>
            <h1>{wishlist.id}</h1>
            <p>{wishlist.status}</p>
            {wishlist.status === "pending" &&
                <form action={deleteWishlist}>
                    <button type="submit">DELETE</button>
                </form>
            }
        </main>
    )
}

export default WishlistPage;