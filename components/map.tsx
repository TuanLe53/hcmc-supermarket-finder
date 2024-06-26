import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Coordinate } from "@/types";

interface MapProps{
    selectedLocation: Coordinate | null;
    setSelectedLocation: (args: Coordinate) => void;
}

function PlaceMarker({selectedLocation, setSelectedLocation}: MapProps) {
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

    return (
        <>
            {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.long]}>
                    <Popup>
                        <p>{selectedLocation.lat}, {selectedLocation.long}</p>
                    </Popup>
                </Marker>
            )}
        </>
    )
}

function Map({selectedLocation, setSelectedLocation}:MapProps) {
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
        </MapContainer>
    )
}

export default Map;