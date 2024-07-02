import { getUserTrips } from "@/db/querys/wishlist";
import { getAuthenticatedUserData } from "@/utils/cookie";

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
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={index}>
                            <td>{trip.id}</td>
                            <td>{trip.updatedAt?.toLocaleDateString()}</td>
                            <td>{trip.status}</td>
                            <td>{trip.status === "accepted" && <button type="button">Delete</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default TripsPage;