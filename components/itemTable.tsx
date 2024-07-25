import { WishlistItem } from "@/types";
import { revalidatePath } from "next/cache";

import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItemFromWishlist, deleteWishlistByID } from "@/db/querys/wishlist";
import { redirect } from "next/navigation";

interface ItemTableProps{
    items: WishlistItem[];
    wishlistID: string;
    wishlistStatus: string;
}

export default function ItemTable({items, wishlistID, wishlistStatus}:ItemTableProps) {

    const deleteItem = async (name: string, quantity: string) => {
        "use server";

        //Delete the wishlist when you delete its last item.
        if (items.length === 1) {
            await deleteWishlistByID(wishlistID);
            redirect("/wishlists");
        }

        await deleteItemFromWishlist(wishlistID, name, quantity);
        revalidatePath(`/wishlist/${wishlistID}`)
    }
    return (
        <table
            className="w-full border-collapse border-4 border-black"
        >
            <thead>
                <tr>
                    <th className="text-left border border-black">Name</th>
                    <th className="text-left border border-black">Quantity</th>
                    {wishlistStatus === "pending" &&
                        <th className="text-left border border-black">Delete</th>
                    }
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td
                            className="text-left border border-black"
                        >
                            {item.name}
                        </td>
                        <td
                            className="text-left border border-black"
                        >
                            {item.quantity}
                        </td>
                        {wishlistStatus === "pending" &&
                            <td className="text-left border border-black">
                                <form action={deleteItem.bind(null, item.name, item.quantity)}>
                                    <button type="submit">
                                        <DeleteIcon />
                                    </button>
                                </form>
                            </td>
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    )
}