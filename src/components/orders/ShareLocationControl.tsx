import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOrderLocation } from '@/hooks/useOrderLocation';
import { LiveLocationMap } from './LiveLocationMap';
import { MapPin, MapPinOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareLocationControlProps {
    orderId: string;
    userId: string;
    userRole: 'buyer' | 'seller';
}

export const ShareLocationControl = ({ orderId, userId, userRole }: ShareLocationControlProps) => {
    const [isSharing, setIsSharing] = useState(false);
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation(isSharing);
    const { locations, updateLocation } = useOrderLocation(orderId);

    useEffect(() => {
        if (isSharing && latitude && longitude) {
            updateLocation(userId, userRole, latitude, longitude);
        }
    }, [isSharing, latitude, longitude, userId, userRole, updateLocation]);

    useEffect(() => {
        if (error && isSharing) {
            toast.error(`Location error: ${error}`);
            setIsSharing(false);
        }
    }, [error, isSharing]);

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isSharing ? (
                        <MapPin className="h-5 w-5 text-primary animate-pulse" />
                    ) : (
                        <MapPinOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                        <Label htmlFor="share-location" className="font-semibold">
                            Share Live Location
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            {isSharing ? 'Your location is being shared with the ' + (userRole === 'buyer' ? 'seller' : 'buyer') : 'Enable to share your location for pickup/delivery'}
                        </p>
                    </div>
                </div>
                <Switch
                    id="share-location"
                    checked={isSharing}
                    onCheckedChange={setIsSharing}
                    disabled={geoLoading}
                />
            </div>

            {(isSharing || locations.length > 0) && (
                <>
                    <LiveLocationMap locations={locations} currentUserRole={userRole} />
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span>Buyer</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span>Seller</span>
                        </div>
                    </div>
                </>
            )}

            {isSharing && geoLoading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Getting your location...</span>
                </div>
            )}
        </div>
    );
};
