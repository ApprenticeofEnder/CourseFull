import { Session } from '@supabase/supabase-js';
import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { getSemester, getSemesters } from '@/services/semester-service';
import { SavedSemester } from '@/types';

import { courseQueryOptions } from './course';

export function semesterListQueryOptions(
    session: Session | null,
    enabled: boolean = true
) {
    return queryOptions({
        queryKey: ['semesters'],
        queryFn: () => getSemesters(session),
        enabled: !!session && enabled,
    });
}

export function useSemesterListQuery(
    session: Session | null,
    enabled: boolean = true
) {
    const {
        data: semesters,
        isLoading: loadingSemesters,
        error,
    } = useQuery(semesterListQueryOptions(session, enabled));

    if (error) {
        throw error;
    }

    return {
        semesters,
        loadingSemesters,
    };
}

export function semesterQueryOptions(
    session: Session | null,
    api_v1_semester_id: string | undefined,
    enabled: boolean = true
) {
    return queryOptions({
        queryKey: ['semesters', api_v1_semester_id!],
        queryFn: () => getSemester(api_v1_semester_id!, session),
        enabled: !!session && !!api_v1_semester_id && enabled,
    });
}

export function useSemesterQuery(
    session: Session | null,
    api_v1_semester_id: string | undefined,
    enabled: boolean = true
) {
    const {
        data: semester,
        isLoading: loadingSemester,
        error,
    } = useQuery(semesterQueryOptions(session, api_v1_semester_id, enabled));

    if (error) {
        throw error;
    }

    return {
        semester,
        loadingSemester,
    };
}

export function useCoursesInSemesterQuery(
    session: Session | null,
    semester: SavedSemester | null
) {
    const courses = semester?.courses ?? [];
    const queries =
        courses.map((course) => {
            return courseQueryOptions(session, course.id, !!semester);
        }) || [];

    const courseQueries = useQueries({
        queries,
    });

    return courseQueries;
}
