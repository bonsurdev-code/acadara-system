import { useState, useCallback } from 'react';
import { adminService } from '../api-services/admin.service';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getStats = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.stats();
            return res;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getStats, loading, error };
};