import { useEffect, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OrderLocation } from '@/types';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const buyerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
    shadowSize: [35, 35]
});

const sellerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowSize: [40, 40]
});

interface LiveLocationMapProps {
    locations: OrderLocation[];
    currentUserRole: 'buyer' | 'seller';
}

function MapController({ locations }: { locations: OrderLocation[] }) {
    const map = useMap();

    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations, map]);

    return null;
}

export const LiveLocationMap = ({ locations, currentUserRole }: LiveLocationMapProps) => {
    const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border shadow-sm mt-4">
            <MapContainer
                center={locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc) => (
                    <LayerGroup key={loc.id}>
                        {/* Accuracy Circle */}
                        <Circle
                            center={[loc.latitude, loc.longitude]}
                            radius={20}
                            pathOptions={{
                                fillColor: loc.userRole === 'buyer' ? '#3b82f6' : '#10b981',
                                fillOpacity: 0.1,
                                color: 'transparent'
                            }}
                        />
                        <Marker
                            position={[loc.latitude, loc.longitude]}
                            icon={loc.userRole === 'buyer' ? buyerIcon : sellerIcon}
                        >
                            <Popup>
                                <div className="text-center p-1">
                                    <div className="font-bold text-primary mb-1">
                                        {loc.userRole === currentUserRole ? 'You (Live)' : (loc.userRole === 'seller' ? 'Seller' : 'Buyer')}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        Updated: {new Date(loc.updatedAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    </LayerGroup>
                ))}

                <MapController locations={locations} />
            </MapContainer>
        </div>
    );
};
