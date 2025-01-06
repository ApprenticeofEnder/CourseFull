import {
    Course,
    CourseDto,
    Endpoints,
    Updated,
} from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';
import { convertCourseFromDto } from '@lib/dto';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null
): Promise<Course> {
    const { data } = await authenticatedApiHandler<CourseDto>(
        async (session, headers) => {
            const response = await api.post<CourseDto>(
                Endpoints.API_COURSES,
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

            return response;
        },
        session
    );

    const course: Course = convertCourseFromDto(data);
    return course;
}

export async function getCourses(
    session: Session | null
): Promise<Course[] | null> {
    const { data } = await authenticatedApiHandler<CourseDto[]>(
        async (session, headers) => {
            return api.get<CourseDto[]>(Endpoints.API_COURSES, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    const courses: Course[] = data.map(convertCourseFromDto);
    return courses;
}

export async function getCourse(
    id: string,
    session: Session | null
): Promise<Course> {
    const { data } = await authenticatedApiHandler<CourseDto>(
        async (session, headers) => {
            return api.get<CourseDto>(`${Endpoints.API_COURSES}/${id}`, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    const course: Course = convertCourseFromDto(data);

    return course;
}

export async function updateCourse(
    { id, title, course_code, status }: Updated<Course>,
    session: Session | null
): Promise<Course> {
    const { data } = await authenticatedApiHandler<CourseDto>(
        async (session, headers) => {
            const apiResponse = await api.put<CourseDto>(
                `${Endpoints.API_COURSES}/${id}`,
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
            return apiResponse;
        },
        session
    );
    const course: Course = convertCourseFromDto(data);

    return course;
}

export async function deleteCourse(
    id: string,
    session: Session | null
): Promise<void> {
    await authenticatedApiHandler(async (session, headers) => {
        const apiResponse = await api.delete(
            `${Endpoints.API_COURSES}/${id}`,
            {
                headers,
                validateStatus: (status) => {
                    return status === 204;
                },
            }
        );
        return apiResponse;
    }, session);
}
