import { Session } from '@supabase/supabase-js';
import assert from 'assert';

import { getApiHeaders } from '@/lib/helpers/service';
import { api } from '@/services';
import {
    BasicUserData,
    CourseFullUser,
    Endpoints,
    SemesterProgressType,
} from '@/types';

export async function createUser(data: BasicUserData): Promise<CourseFullUser> {
    assert(data.supabase_id);
    const apiResponse = await api.post<CourseFullUser>(
        Endpoints.Api.API_USER,
        {
            api_v1_user: data,
        },
        {
            validateStatus: (status) => {
                return status === 201;
            },
        }
    );
    return apiResponse.data;
}

export async function getProgress(
    session: Session | null
): Promise<SemesterProgressType[]> {
    const headers = getApiHeaders(session);
    const apiResponse = await api.get<SemesterProgressType[]>(
        Endpoints.Api.API_PROGRESS,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    return apiResponse.data;
}

export async function getUserData(
    session: Session | null
): Promise<CourseFullUser> {
    const headers = getApiHeaders(session);
    const apiResponse = await api.get<CourseFullUser>(
        `${Endpoints.Api.API_USER}/me`,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    return apiResponse.data;
}

// export async function updateUserDetails(
//     first_name: string,
//     last_name: string,
//     email: string,
//     session: Session
// ): Promise<User> {
//     const res = await authenticatedApiHandler<User>(
//         async (session, headers) => {
//             TODO: Convert this to a server action
//             const apiResponse = await api.put<User>(
//                 `${Endpoints.API_USER}/me`,
//                 {
//                     api_v1_user: {
//                         first_name,
//                         last_name,
//                         email,
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
//     return res.data;
// }

// export async function deleteUser(
//     session: Session
// ): Promise<void> {
//     TODO: Convert this to a server action
//     await authenticatedApiHandler(
//         async (session, headers) => {
//             const apiResponse = await api.delete(`${Endpoints.API_USER}/me`, {
//                 headers,
//                 validateStatus: (status) => {
//                     return status === 204;
//                 },
//             });
//             return apiResponse;
//         },
//         session
//     );
// }
