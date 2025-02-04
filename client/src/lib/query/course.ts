import { Session } from '@supabase/supabase-js';
import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { processPossibleApiError } from '@/lib/errors';
import { useTimeDispatch } from '@/lib/time/TimeContext';
import {
    createCourse,
    deleteCourse,
    getCourse,
    getCourses,
    updateCourse,
} from '@/services/course-service';
import { Course, SavedCourse } from '@/types';

import { useSession } from '../supabase/SessionContext';

export function courseQueryOptions(
    session: Session | null,
    api_v1_course_id: string | undefined,
    enabled: boolean = true
) {
    return queryOptions({
        queryKey: ['courses', api_v1_course_id!],
        queryFn: () => getCourse(api_v1_course_id!, session),
        enabled: !!session && !!api_v1_course_id && enabled,
    });
}

export function useCourseQuery(
    session: Session | null,
    api_v1_course_id: string | undefined,
    enabled: boolean = true
) {
    const {
        data: course,
        isLoading: loadingCourse,
        error,
    } = useQuery(courseQueryOptions(session, api_v1_course_id, enabled));
    if (error) {
        processPossibleApiError(error);
    }

    return {
        course,
        loadingCourse,
    };
}

export function courseListQueryOptions(
    session: Session | null,
    enabled: boolean = true
) {
    return queryOptions({
        queryKey: ['courses'],
        queryFn: () => getCourses(session),
        enabled: !!session && enabled,
    });
}

export function useCourseListQuery(
    session: Session | null,
    enabled: boolean = true
) {
    const {
        data: courses,
        isLoading: loadingCourses,
        error,
    } = useQuery(courseListQueryOptions(session, enabled));
    if (error) {
        processPossibleApiError(error);
    }

    return {
        courses,
        loadingCourses,
    };
}

export function useCourseCreateMutation() {
    const queryClient = useQueryClient();
    const { session } = useSession();
    const {
        isPending: courseCreatePending,
        mutate: courseCreateMutate,
        error,
    } = useMutation({
        mutationFn: (course: Course) => {
            console.log(session);
            return createCourse(course, session);
        },
        onSuccess: () => {
            // For some reason invalidating individual queries wasn't doing it?
            queryClient.invalidateQueries();
        },
    });
    if (error) {
        processPossibleApiError(error);
    }
    return { courseCreatePending, courseCreateMutate };
}

export function useCourseUpdateMutation() {
    const { session } = useSession();
    const queryClient = useQueryClient();
    const {
        isPending: courseUpdatePending,
        mutate: courseUpdateMutate,
        error,
    } = useMutation({
        mutationFn: (course: SavedCourse | undefined) => {
            if (!course) {
                return Promise.reject('Course not defined');
            }
            return updateCourse(course, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
    });
    if (error) {
        processPossibleApiError(error);
    }
    return { courseUpdatePending, courseUpdateMutate };
}

export function useCourseDeleteMutation(
    session: Session | null,
    course: SavedCourse | undefined
) {
    const queryClient = useQueryClient();
    const timeDispatch = useTimeDispatch();
    const {
        isPending: courseDeletePending,
        mutate: courseDeleteMutate,
        error,
    } = useMutation({
        mutationFn: () => {
            if (!course) {
                return Promise.reject('Course not defined');
            }
            return deleteCourse(course.id, session);
        },
        onSuccess: () => {
            timeDispatch({ type: 'CLEAR_DELIVERABLES' });
            queryClient.invalidateQueries();
        },
    });
    if (error) {
        processPossibleApiError(error);
    }
    return { courseDeletePending, courseDeleteMutate };
}
