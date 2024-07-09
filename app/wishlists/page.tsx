import { getUserWishlists } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import Link from "next/link";

async function WishlistsPage() {
    const userData = await getAuthenticatedUserData();
    const wishlists = await getUserWishlists(userData?.id as string);

    console.log(wishlists);

    return (
        <main>
            <h1>Wishlists Page</h1>
            {wishlists.map((wishlist, index) => (
                <div key={index}>
                    <Link href={`/wishlists/${wishlist.id}`}>{wishlist.id}</Link>
                    <p>{wishlist.status}</p>
                </div>
            ))}
        </main>
    )
}

export default WishlistsPage;