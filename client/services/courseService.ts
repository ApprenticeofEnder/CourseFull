import {
    Course,
    CourseDto,
    Deliverable,
    Endpoints,
    ModifyCourseDto,
} from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';
import { convertCourseDto } from '@lib/dto';
import { AxiosResponse } from '@node_modules/axios';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null
): Promise<Course | null> {
    const res = await authenticatedApiHandler<CourseDto>(
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

    const { data } = res;
    const course: Course = convertCourseDto(data);
    return course;
}

export async function getCourses(
    session: Session | null
): Promise<Course[] | null> {
    const res = await authenticatedApiHandler<CourseDto[]>(
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
    const { data } = res;
    const courses: Course[] = data.map(convertCourseDto);
    return courses;
}

export async function getCourse(
    id: string,
    session: Session | null
): Promise<Course> {
    const res = await authenticatedApiHandler<CourseDto>(
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
    const { data } = res;
    const course: Course = convertCourseDto(data);

    return course;
}

export async function updateCourse(
    { id, title, course_code, status }: Partial<Course>,
    session: Session | null
): Promise<Course> {
    const res = await authenticatedApiHandler<CourseDto>(
        async (session, headers) => {
            const apiResponse = await api.put<
                ModifyCourseDto,
                AxiosResponse<CourseDto>
            >(
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
    const { data } = res;
    const course: Course = convertCourseDto(data);

    return course;
}

export async function deleteCourse(
    id: string,
    session: Session | null
): Promise<null> {
    await authenticatedApiHandler<null>(
        async (session, headers) => {
            const apiResponse = await api.delete<null>(
                `${Endpoints.API_COURSES}/${id}`,
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 204;
                    },
                }
            );
            return apiResponse;
        },
        session
    );
    return null;
}
