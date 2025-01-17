import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { getCourse } from '@/services/course-service';

export function useCourseQuery(
    session: Session | null,
    api_v1_course_id: string | undefined,
    enabled: boolean = true
) {
    const {
        data: course,
        isLoading: loadingCourse,
        error,
    } = useQuery({
        queryKey: ['course', api_v1_course_id],
        queryFn: () => {
            return getCourse(api_v1_course_id!, session);
        },
        enabled: enabled && !!api_v1_course_id && !!session,
    });
    if (error) {
        throw error;
    }

    return {
        course,
        loadingCourse,
    };
}
