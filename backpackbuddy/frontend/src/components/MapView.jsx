import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const MapView = ({ locations }) => {
  // Filter out locations that don't have valid lat/lon
  const validLocations = locations.filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lon === 'number');

  if (validLocations.length === 0) {
    return (
      <div className="h-96 bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No map data available for this itinerary.</p>
      </div>
    );
  }

  // Calculate the center of the map
  const centerLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
  const centerLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;

  return (
    <MapContainer center={[centerLat, centerLon]} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validLocations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lon]}>
          <Popup>
            {location.name || 'A location in your itinerary'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
