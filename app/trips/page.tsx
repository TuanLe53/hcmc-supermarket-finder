import { getUserTrips } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";
import Link from "next/link";

async function TripsPage() {
    const userData = await getAuthenticatedUserData();
    const trips = await getUserTrips(userData?.id as string);

    return (
        <main>
            <p>Trip page</p>

            <table className="table-fixed">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Updated at</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={index}>
                            <td>
                                <Link href={`/trips/${trip.id}`}>{trip.id}</Link>
                            </td>
                            <td>{trip.updatedAt?.toLocaleDateString()}</td>
                            <td>{trip.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default TripsPage;