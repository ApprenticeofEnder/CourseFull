import { Session } from '@supabase/supabase-js';
import {
    queryOptions,
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { processPossibleApiError } from '@/lib/errors';
import { courseQueryOptions } from '@/lib/query/course';
import { useSession } from '@/lib/supabase/SessionContext';
import { useTimeDispatch } from '@/lib/time/TimeContext';
import {
    deleteSemester,
    getSemester,
    getSemesters,
} from '@/services/semester-service';
import { SavedSemester } from '@/types';

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

export function useSemesterListQuery(enabled: boolean = true) {
    const { session } = useSession();
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
    api_v1_semester_id: string | undefined,
    enabled: boolean = true
) {
    const { session } = useSession();
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
    semester: SavedSemester | null | undefined
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

export function useSemesterDeleteMutation(
    session: Session | null,
    semester: SavedSemester | undefined
) {
    const queryClient = useQueryClient();
    const timeDispatch = useTimeDispatch();
    const {
        isPending: semesterDeletePending,
        mutate: semesterDeleteMutate,
        error,
    } = useMutation({
        mutationFn: () => {
            if (!semester) {
                return Promise.reject('Semester not defined');
            }
            return deleteSemester(semester.id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester'],
            });
            queryClient.invalidateQueries({
                queryKey: ['course'],
            });
            queryClient.invalidateQueries({
                queryKey: ['deliverables'],
            });
            timeDispatch({ type: 'CLEAR_DELIVERABLES' });
        },
    });
    if (error) {
        processPossibleApiError(error);
    }
    return {
        semesterDeletePending,
        semesterDeleteMutate,
    };
}
