import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Coordinate, LocationMarker } from "@/types";
import { useEffect } from "react";

interface MapProps {
    selectedLocation: Coordinate | null;
    setSelectedLocation: (args: Coordinate) => void;
    markers: LocationMarker[];
    markerType: "wishlist" | "supermarket" | "detail";
    flyToLocation: [number, number] | null;
};

const marketIcon = L.icon({
    iconUrl: "shop_icon.svg",
    iconSize: [25, 41],
});

const wishlistIcon = L.icon({
    iconUrl: "cart_icon.svg",
    iconSize: [25, 41],
});

function PlaceMarker({
    selectedLocation,
    setSelectedLocation
}: Pick<MapProps, "selectedLocation" | "setSelectedLocation">
) {
    const map = useMapEvents({
        click(e) {
            const lat = e.latlng.lat;
            const long = e.latlng.lng;

            setSelectedLocation({
                long,
                lat
            })
        }
    })

    if (selectedLocation) {
        return (            
            <Marker position={[selectedLocation.lat, selectedLocation.long]}>
                <Popup>
                    <p>{selectedLocation.lat}, {selectedLocation.long}</p>
                </Popup>
            </Marker>
        )
    }
}

function FlyToLocation(
    { selectedLocation }: { selectedLocation: [number, number] | null; }
) {
    const map = useMap();

    useEffect(() => {
        if (selectedLocation !== null) {
            map.flyTo([selectedLocation[1], selectedLocation[0]], 13)
        }
    }, [selectedLocation])
    
    return null;
}

function DrawMarkers({markers, markerType}: Pick<MapProps, "markers" | "markerType">) {
    if (markerType === "supermarket") {
        return (
            markers.map((marker) => (
                <Marker key={marker.id} position={[marker.location[1], marker.location[0]]} icon={marketIcon}>
                    <Popup>
                        <p>{marker.name}</p>
                    </Popup>
                </Marker>
            ))
        )
    } else if (markerType === "wishlist") {
        return (
            markers.map((marker, index) => (
                <Marker key={index} position={[marker.location[1], marker.location[0]]} icon={wishlistIcon}>
                    <Popup>
                        <p>{marker.name}</p>
                    </Popup>
                </Marker>
            ))
        )
    } else {
        return (
            markers.map((marker, index) => (
                <Marker key={index} position={[marker.location[1], marker.location[0]]} icon={marker.type === "supermarket" ? marketIcon : wishlistIcon}>
                    <Popup>
                        <p>{marker.name}</p>
                    </Popup>
                </Marker>
            ))
        )
    }
}

function Map({
    selectedLocation,
    setSelectedLocation,
    markers,
    markerType,
    flyToLocation
}: MapProps) {

    return (
        <MapContainer center={[10.7763897, 106.7011391]} zoom={10} scrollWheelZoom={false} style={{height: "100vh"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <PlaceMarker
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
            />

            <FlyToLocation
                selectedLocation={flyToLocation}
            />

            {markers.length > 0 &&
                <DrawMarkers markers={markers} markerType={markerType} />
            }
        </MapContainer>
    )
}

export default Map;