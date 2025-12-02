import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelect }) => {
    
    const [position, setPosition] = useState({ lat: 6.9271, lng: 79.8612 });

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng);
            },
        });
        return position === null ? null : <Marker position={position}></Marker>;
    };

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
            <MapContainer 
                center={position} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />
                <LocationMarker />
            </MapContainer>
            <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold shadow z-[1000]">
                Tap map to set location
            </div>
        </div>
    );
};

export default LocationPicker;