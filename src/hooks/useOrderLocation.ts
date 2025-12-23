import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { OrderLocation } from '@/types';

export const useOrderLocation = (orderId: string | undefined) => {
    const [locations, setLocations] = useState<OrderLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        // Initial fetch
        const fetchLocations = async () => {
            const { data, error } = await supabase
                .from('order_locations')
                .select('*')
                .eq('order_id', orderId);

            if (!error && data) {
                setLocations(data as OrderLocation[]);
            }
            setLoading(false);
        };

        fetchLocations();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`order-locations-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'order_locations',
                    filter: `order_id=eq.${orderId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setLocations(prev => [...prev, payload.new as OrderLocation]);
                    } else if (payload.eventType === 'UPDATE') {
                        setLocations(prev =>
                            prev.map(loc => loc.id === payload.new.id ? (payload.new as OrderLocation) : loc)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setLocations(prev => prev.filter(loc => loc.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    const updateLocation = async (userId: string, role: 'buyer' | 'seller', lat: number, lng: number) => {
        if (!orderId) return;

        const { error } = await supabase
            .from('order_locations')
            .upsert({
                order_id: orderId,
                user_id: userId,
                user_role: role,
                latitude: lat,
                longitude: lng,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'order_id,user_id'
            });

        return { error };
    };

    return { locations, loading, updateLocation };
};
