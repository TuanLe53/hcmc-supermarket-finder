"use client";

import { Coordinate } from "@/types";
import { useState } from "react";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), {
	ssr: false,
	loading: () => <p>Loading...</p>
})



function MapPage() {
	const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);

	return (
		<main className="h-screen w-full grid grid-cols-4">
			<div className="col-span-3">
				<Map
					setSelectedLocation={setSelectedLocation}
					selectedLocation={selectedLocation}
				/>
			</div>

			<div className="bg-orange-300">
				<p>Hello world</p>
			</div>
		</main>
	)
}

export default MapPage;