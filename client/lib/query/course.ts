import { Course, ItemStatus, Updated } from '@coursefull';
import { deleteCourse, getCourse, updateCourse } from '@services/courseService';
import { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CourseQueryOptions {
    prefetch?: () => void,
    enabled?: boolean
}

export function useCourseQuery(
    courseId: string,
    session: Session,
    options?: CourseQueryOptions
) {
    const courseQuery = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => {
            if (options?.prefetch) {
                options.prefetch();
            }
            return getCourse(courseId, session);
        },
        enabled: session !== null,
    });
    if (courseQuery.error) {
        throw courseQuery.error;
    }
    return courseQuery;
}

// TODO: Migrate remaining queries/mutations + populate other @lib/query files

export function useCourseComplete(
    courseId: string,
    semesterId: string,
    session: Session
) {
    const queryClient = useQueryClient();
    const courseComplete = useMutation({
        mutationFn: (course: Course) => {
            return updateCourse(
                { ...course, status: ItemStatus.COMPLETE } as Updated<Course>,
                session
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', semesterId],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', courseId],
            });
        },
    });
    if (courseComplete.error) {
        throw courseComplete.error;
    }
    return courseComplete;
}

export function useCourseDelete(
    courseId: string,
    courseCode: string,
    semesterId: string,
    session: Session
) {
    const queryClient = useQueryClient();
    const courseDelete = useMutation({
        mutationFn: (id: string) => {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${courseCode}? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.`
            );
            if (!confirmDelete) {
                return Promise.resolve();
            }
            return deleteCourse(id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', semesterId],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', courseId],
            });
        },
    });
    if (courseDelete.error) {
        throw courseDelete.error;
    }
    return courseDelete;
}
