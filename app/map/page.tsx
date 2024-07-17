"use client";

import { Coordinate, LocationMarker } from "@/types";
import { useState } from "react";

import dynamic from "next/dynamic";
import Panel from "@/components/controlPanel";

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
		<main className="w-full flex flex-row">
			<div className="flex-grow">
				<Map
					setSelectedLocation={setSelectedLocation}
					selectedLocation={selectedLocation}
					markers={markers}
					markerType={markerType}
					flyToLocation={flyToLocation}
				/>
			</div>

			<div className="control-panel-container flex-none bg-white">
				<Panel
					selectedLocation={selectedLocation}
					markers={markers}
					markerType={markerType}
					setSelectedLocation={setSelectedLocation}
					setFlyToLocation={setFlyToLocation}
					setMarkerType={setMarkerType}
					setMarkers={setMarkers}
				/>
			</div>
		</main>
	)
}

export default MapPage;