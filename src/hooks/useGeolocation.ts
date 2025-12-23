import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeolocation = (enabled: boolean = false) => {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: false,
    });

    useEffect(() => {
        if (!enabled) return;

        if (!navigator.geolocation) {
            setState(s => ({ ...s, error: 'Geolocation is not supported by your browser' }));
            return;
        }

        setState(s => ({ ...s, loading: true }));

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                setState({
                    latitude: null,
                    longitude: null,
                    error: error.message,
                    loading: false,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [enabled]);

    return state;
};
