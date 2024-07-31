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
            className="w-full border-collapse"
        >
            <thead>
                <tr className="border-b border-black">
                    <th className="text-left">Name</th>
                    <th className="text-left">Quantity</th>
                    {wishlistStatus === "pending" &&
                        <th className="text-center text-red-600">Delete</th>
                    }
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td
                            className="text-left border-b border-black"
                        >
                            {item.name}
                        </td>
                        <td
                            className="text-left border-b border-black"
                        >
                            {item.quantity}
                        </td>
                        {wishlistStatus === "pending" &&
                            <td className="text-center border-b border-black">
                                <form action={deleteItem.bind(null, item.name, item.quantity)}>
                                    <button type="submit">
                                        <DeleteIcon className="text-red-600"/>
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