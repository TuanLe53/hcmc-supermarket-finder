"use client";

import { Coordinate, LocationMarker } from "@/types";
import { useState } from "react";

import dynamic from "next/dynamic";
import ControlPanel from "@/components/controlPanel";

const Map = dynamic(() => import("@/components/map"), {
	ssr: false,
	loading: () => <p>Loading...</p>
})

function MapPage() {
	const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);
	const [markers, setMarkers] = useState<LocationMarker[]>([]);
	const [markerType, setMarkerType] = useState<"wishlist" | "supermarket" | "detail">("supermarket");

	const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null);

	return (
		<main className="h-screen w-full grid grid-cols-4">
			<div className="col-span-3">
				<Map
					setSelectedLocation={setSelectedLocation}
					selectedLocation={selectedLocation}
					markers={markers}
					markerType={markerType}
					flyToLocation={flyToLocation}
				/>
			</div>

			<div className="bg-orange-300">
				<ControlPanel
					markers={markers}
					markerType={markerType}
					setMarkers={setMarkers}
					setMarkerType={setMarkerType}
					selectedLocation={selectedLocation}
					setSelectedLocation={setSelectedLocation}
					setFlyToLocation={setFlyToLocation}
				/>
			</div>
		</main>
	)
}

export default MapPage;