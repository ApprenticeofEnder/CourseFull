import { Session } from '@supabase/supabase-js';
import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { processPossibleApiError } from '@/lib/errors';
import {
    deleteCourse,
    getCourse,
    getCourses,
    updateCourse,
} from '@/services/course-service';
import { SavedCourse } from '@/types';

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

export function useCourseUpdateMutation(
    session: Session | null,
    course: SavedCourse | undefined
) {
    const queryClient = useQueryClient();
    const {
        isPending: courseUpdatePending,
        mutate: courseUpdateMutate,
        error,
    } = useMutation({
        mutationFn: () => {
            if (!course) {
                return Promise.reject('Course not defined');
            }
            return updateCourse(course, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', course?.api_v1_semester_id],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', course?.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['deliverables'],
            });
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
            queryClient.invalidateQueries({
                queryKey: ['semester', course?.api_v1_semester_id],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', course?.id],
            });
            queryClient.invalidateQueries({
                queryKey: ['deliverables'],
            });
        },
    });
    if (error) {
        processPossibleApiError(error);
    }
    return { courseDeletePending, courseDeleteMutate };
}
