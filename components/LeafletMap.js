import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix for the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Position set to Parkland Building in Colombo
const position = [6.9271, 79.8612];

export default function LeafletMap() {
  useEffect(() => {
    return () => {
      const mapContainer = document.querySelector(".leaflet-container");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null; // Reset Leaflet ID to prevent duplication
      }
    };
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Level 12, Parkland Building, 33 Park St, Colombo 00200</Popup>
      </Marker>
    </MapContainer>
  );
}
