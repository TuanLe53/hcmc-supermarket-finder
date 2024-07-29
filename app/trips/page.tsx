import { db } from "@/db/db";
import { Supermarket, User, WishList } from "@/db/schemas";
import { getAuthenticatedUserData } from "@/utils/cookie";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import Link from "next/link";

async function TripsPage() {
    const userData = await getAuthenticatedUserData();

    const trips = await db.select({
        id: WishList.id,
        status: WishList.status,
        updatedAt: WishList.updatedAt,
        supermarket: Supermarket.name,
        owner: User.name
    })
        .from(WishList)
        .leftJoin(Supermarket, eq(WishList.supermarket, Supermarket.id))
        .leftJoin(User, eq(WishList.owner, User.id))
        .where(eq(WishList.buyer, userData?.id as string))

    return (
        <main
            className="h-screen mx-24 mt-10"
        >
            <h1 className="text-3xl font-medium mb-2">Your Trips</h1>
            <table
                className="max-h-4/5 border-collapse border border-4 border-slate-500"
            >
                <thead>
                    <tr className="bg-slate-300">
                        <th className="text-left border border-slate-700">ID</th>
                        <th className="text-left border border-slate-700">Supermarket</th>
                        <th className="text-left border border-slate-700">Owner</th>
                        <th className="text-left border border-slate-700">Status</th>
                        <th className="text-left border border-slate-700">Accepted at</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={index}>
                            <td className="py-2 pr-2 text-left border border-slate-700">
                                <Link href={`/trips/${trip.id}`}>                                
                                    {trip.id} 
                                </Link>
                            </td>
                            <td className="py-2 pr-2 text-left border border-slate-700">
                                {trip.supermarket} 
                            </td>
                            <td className="py-2 pr-2 text-left border border-slate-700">
                                {trip.owner} 
                            </td>
                            <td className="py-2 pr-2 text-left border border-slate-700">
                                {trip.status} 
                            </td>
                            <td className="py-2 pr-2 text-left border border-slate-700">
                                {format(trip.updatedAt as Date, "dd/MM/yyyy")} 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default TripsPage;