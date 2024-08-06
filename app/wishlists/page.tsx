import { getUserWishlists } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { format } from "date-fns";
import Link from "next/link";

import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";

async function WishlistsPage() {
    const userData = await getAuthenticatedUserData();
    const wishlists = await getUserWishlists(userData?.id as string);

    return (
        <main
            className="relative h-screen p-1"
        >
            <div className="absolute">
                <Link href={"/profile"} className="hover:underline">
                    <ArrowBackIosNew fontSize="small" />
                    Profile
                </Link>
            </div>
            <div className="mx-24">
                <h1 className="text-3xl font-medium mb-2">Your Wishlists</h1>
                <table
                    className="max-h-4/5 border-collapse border border-4 border-slate-500"
                >
                    <thead>
                        <tr className="bg-slate-300">
                            <th className="text-left border border-slate-700">ID</th>
                            <th className="text-left border border-slate-700">Supermarket</th>
                            <th className="text-left border border-slate-700">Created at</th>
                            <th className="text-left border border-slate-700">Updated at</th>
                            <th className="text-left border border-slate-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlists.map((wishlist, index) => (
                            <tr key={index}>
                                <td className="py-2 pr-2 text-left border border-slate-700">
                                    <Link href={`/wishlists/${wishlist.id}`}>                                
                                        {wishlist.id}
                                    </Link>
                                </td>
                                <td className="py-2 pr-2 text-left border border-slate-700">{wishlist.supermarket}</td>
                                <td className="py-2 pr-2 text-left border border-slate-700">{format(wishlist.createdAt as Date, "dd/MM/yyyy")}</td>
                                <td className="py-2 pr-2 text-left border border-slate-700">{format(wishlist.updatedAt as Date, "dd/MM/yyyy")}</td>
                                <td className="py-2 pr-2 text-left border border-slate-700">{wishlist.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default WishlistsPage;