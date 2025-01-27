import { Session } from '@supabase/supabase-js';

import { getApiHeaders } from '@/lib/helpers';
import { convertCourseFromDto } from '@/lib/helpers/dto';
import { api } from '@/services';
import { Course, CourseDto, Endpoints, SavedCourse } from '@/types';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null
): Promise<SavedCourse> {
    const headers = getApiHeaders(session);
    const { data } = await api.post<CourseDto>(
        Endpoints.Api.API_COURSES,
        {
            api_v1_course: {
                title,
                course_code,
                status,
                api_v1_semester_id,
            },
        },
        {
            headers,
            validateStatus: (status) => {
                return status === 201;
            },
        }
    );

    const course: SavedCourse = convertCourseFromDto(data);
    return course;
}

export async function getCourses(
    session: Session | null
): Promise<SavedCourse[]> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<CourseDto[]>(Endpoints.Api.API_COURSES, {
        headers,
        validateStatus: (status) => {
            return status === 200;
        },
    });
    const courses: SavedCourse[] = data.map(convertCourseFromDto);
    return courses;
}

export async function getCourse(
    id: string,
    session: Session | null
): Promise<SavedCourse> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<CourseDto>(
        `${Endpoints.Api.API_COURSES}/${id}`,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    const course: SavedCourse = convertCourseFromDto(data);
    return course;
}

export async function updateCourse(
    { id, title, course_code, status }: SavedCourse,
    session: Session | null
): Promise<SavedCourse> {
    const headers = getApiHeaders(session);
    const { data } = await api.put<CourseDto>(
        `${Endpoints.Api.API_COURSES}/${id}`,
        {
            api_v1_course: {
                title,
                course_code,
                status,
            },
        },
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );

    const course: SavedCourse = convertCourseFromDto(data);

    return course;
}

export async function deleteCourse(
    api_v1_course_id: string,
    session: Session | null
): Promise<void> {
    const headers = getApiHeaders(session);
    await api.delete(`${Endpoints.Api.API_COURSES}/${api_v1_course_id}`, {
        headers,
        validateStatus: (status) => {
            return status === 204;
        },
    });
}
