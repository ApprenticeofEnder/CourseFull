import { Session } from '@supabase/supabase-js';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getCourse } from '@/services/course-service';
import { getSemesters } from '@/services/semester-service';
import { SavedSemester } from '@/types';

export function useSemestersQuery(session: Session | null) {
    const {
        data: semesters,
        isLoading: loadingSemesters,
        error,
    } = useQuery({
        queryKey: ['semesters'],
        queryFn: () => getSemesters(session),
        enabled: !!session,
    });

    if (error) {
        throw error;
    }

    return {
        semesters,
        loadingSemesters,
    };
}

export function useCoursesInSemesterQuery(
    session: Session | null,
    semester: SavedSemester | null
) {
    const courses = semester?.courses ?? [];
    const queries =
        courses.map((course) => {
            return {
                queryKey: ['course', course.id!],
                queryFn: () => getCourse(course.id!, session),
                enabled: !!session && !!course,
            };
        }) || [];

    const courseQueries = useQueries({
        queries,
    });

    return courseQueries;
}
