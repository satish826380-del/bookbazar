import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Loader2, AlertCircle } from 'lucide-react';

// Stabilize Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
}

function MapEvents({ onMove }: { onMove: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        dragend: () => {
            const center = map.getCenter();
            onMove(center.lat, center.lng);
        },
        zoomend: () => {
            const center = map.getCenter();
            onMove(center.lat, center.lng);
        }
    });
    return null;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center]);
    return null;
}

export const LocationPicker = ({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) => {
    const [position, setPosition] = useState<[number, number]>(
        initialLat && initialLng ? [initialLat, initialLng] : [20.5937, 78.9629]
    );
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [geoError, setGeoError] = useState<string | null>(null);

    const fetchAddress = async (lat: number, lng: number) => {
        setLoading(true);
        setGeoError(null);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
            );
            const data = await response.json();
            const displayAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setAddress(displayAddress);
            onLocationSelect(lat, lng, displayAddress);
        } catch (error) {
            console.error('Error fetching address:', error);
            onLocationSelect(lat, lng, `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleManualMove = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
    }, []);

    const usePreciseGPS = () => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                fetchAddress(latitude, longitude);
            },
            (error) => {
                setLoading(false);
                console.error('Geolocation Error:', error);

                // Handle specific error codes
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        setGeoError("Please enable location permissions in your browser settings.");
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        setGeoError("Location information is unavailable. Try moving to a better spot.");
                        break;
                    case 3: // TIMEOUT
                        setGeoError("Location request timed out. Please try again.");
                        break;
                    default:
                        setGeoError("An unknown error occurred while fetching location.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        if (!initialLat) {
            usePreciseGPS();
        }
    }, []);

    return (
        <div className="space-y-4">
            <div className="relative h-[300px] w-full rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/20 shadow-md">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEvents onMove={handleManualMove} />
                    <ChangeView center={position} />
                </MapContainer>

                {/* Fixed Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none mb-4">
                    <div className="relative">
                        <MapPin className="h-10 w-10 text-destructive fill-destructive/20 drop-shadow-xl" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/30 rounded-full blur-[2px]"></div>
                    </div>
                </div>

                <Button
                    type="button"
                    size="sm"
                    className="absolute bottom-4 right-4 z-[1000] shadow-xl rounded-full h-10 px-4 bg-primary text-white border-2 border-white/20"
                    onClick={usePreciseGPS}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
                    Detect My Location
                </Button>
            </div>

            {geoError && (
                <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{geoError} <span className="font-semibold underline cursor-pointer ml-1" onClick={() => setGeoError(null)}>Dismiss</span></p>
                </div>
            )}

            {!geoError && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 transition-all duration-200">
                    <div className="flex gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg h-fit">
                            <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Pickup Address Confirmation</p>
                            {loading ? (
                                <div className="space-y-1.5 py-1">
                                    <div className="h-3 bg-primary/10 animate-pulse rounded w-48" />
                                    <div className="h-3 bg-primary/10 animate-pulse rounded w-32" />
                                </div>
                            ) : (
                                <p className="text-sm text-foreground font-medium leading-relaxed">
                                    {address || 'Drag the map to pinpoint your location'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <p className="text-center text-[11px] text-muted-foreground italic">
                Tip: You can drag the map to adjust the pickup point precisely.
            </p>
        </div>
    );
};
