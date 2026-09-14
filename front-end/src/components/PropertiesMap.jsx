import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default center used only when nothing on screen has coordinates yet
const DEFAULT_CENTER = [22.9734, 78.6569]; // roughly the center of India

const PropertiesMap = ({ properties = [], height = "70vh" }) => {
  const withCoords = properties.filter((p) => p.latitude && p.longitude);
  const center = withCoords.length > 0 ? [withCoords[0].latitude, withCoords[0].longitude] : DEFAULT_CENTER;

  return (
    <div style={{ height, width: "100%" }} className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {withCoords.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm px-6 text-center">
          None of the current listings have a mappable location yet.
        </div>
      ) : (
        <MapContainer center={center} zoom={5} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((property) => (
            <Marker key={property._id} position={[property.latitude, property.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-gray-600">{property.locality}, {property.city}</p>
                  <p className="text-red-700 font-semibold mt-1">${property.price}</p>
                  <Link to={`/property/${property._id}`} className="text-blue-600 underline mt-1 inline-block">
                    View details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default PropertiesMap;
