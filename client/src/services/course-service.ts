import { Session } from '@supabase/supabase-js';

import { getApiHeaders } from '@/lib/helpers';
import { convertCourseFromDto } from '@/lib/helpers/dto';
import { api } from '@/services';
import { Course, CourseDto, Endpoints, SavedCourse } from '@/types';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null
): Promise<Course> {
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

    const course: Course = convertCourseFromDto(data);
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
    const courses: SavedCourse[] = data.map((dto) => {
        return convertCourseFromDto(dto) as SavedCourse;
    });
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
    const course: SavedCourse = convertCourseFromDto(data) as SavedCourse;
    return course;
}

// export async function updateCourse(
//     { id, title, course_code, status }: Updated<Course>,
//     session: Session | null
// ): Promise<Course> {
//     const { data } = await authenticatedApiHandler<CourseDto>(
//         async (session, headers) => {
//             const apiResponse = await api.put<CourseDto>(
//                 `${Endpoints.API_COURSES}/${id}`,
//                 {
//                     api_v1_course: {
//                         title,
//                         course_code,
//                         status,
//                     },
//                 },
//                 {
//                     headers,
//                     validateStatus: (status) => {
//                         return status === 200;
//                     },
//                 }
//             );
//             return apiResponse;
//         },
//         session
//     );
//     const course: Course = convertCourseFromDto(data);

//     return course;
// }

// export async function deleteCourse(
//     id: string,
//     session: Session | null
// ): Promise<void> {
//     await authenticatedApiHandler(async (session, headers) => {
//         const apiResponse = await api.delete(`${Endpoints.API_COURSES}/${id}`, {
//             headers,
//             validateStatus: (status) => {
//                 return status === 204;
//             },
//         });
//         return apiResponse;
//     }, session);
// }
