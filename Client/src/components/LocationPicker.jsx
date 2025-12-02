import { useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem' // Rounded-xl matching your UI
};

// Default Center (Colombo)
const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarkerPosition({ lat, lng });
    onLocationSelect({ lat, lng }); // Send coordinates to parent form
  }, [onLocationSelect]);

  if (!isLoaded) return <div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Maps...</div>;

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onClick={onMapClick}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
        }}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
      
      {/* Floating Helper Text */}
      <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-md text-xs font-bold shadow-md text-gray-700 z-10 backdrop-blur-sm">
        📍 Tap anywhere to set pickup location
      </div>
    </div>
  );
};

export default memo(LocationPicker);