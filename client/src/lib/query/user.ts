import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { getProgress, getUserData } from '@/services/user-service';

export function useProgressQuery(session: Session | null) {
    const {
        data: progressData,
        isLoading: loadingProgress,
        error,
    } = useQuery({
        queryKey: ['progress'],
        queryFn: () => {
            return getProgress(session);
        },
        enabled: !!session,
    });

    if (error) {
        throw error;
    }

    return {
        progressData,
        loadingProgress,
    };
}

export function useUserDataQuery(session: Session | null) {
    const {
        data: userData,
        isLoading: loadingUserData,
        error: userError,
    } = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            return getUserData(session);
        },
        enabled: !!session,
    });
    if (userError) {
        throw userError;
    }

    return {
        userData,
        loadingUserData,
    };
}
