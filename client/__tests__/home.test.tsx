import {
    describe,
    it,
    beforeEach,
    beforeAll,
    afterAll,
    afterEach,
    expect,
    vi,
} from 'vitest';
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import Home from '@/app/page';
import { supabase, useSupabaseSession } from '@/supabase';
import { userAccessToken, USER1, USER2, jwtDecode } from '@/vitest.setup';

const server = setupServer(
    http.get('/api/v1/semesters', ({ request, params, cookies }) => {
        const authtoken = request.headers
            .get('Authorization')
            ?.split(' ')
            .pop();
        if (!authtoken) {
            return HttpResponse.json(
                { message: 'Please log in' },
                { status: 401 }
            );
        }
        return HttpResponse.json([
            {
                id: 'c66d1814-aaf1-43c9-b222-a09feb14de08',
                name: 'Fall 2024',
                status: 'active',
                goal: 80.0,
                api_v1_user_id: '0e343dd5-e335-409d-9a1f-a1c1fa57d488',
                created_at: '2024-05-10T04:44:43.338Z',
                updated_at: '2024-05-10T04:44:43.338Z',
                courses: [
                    {
                        id: '60d9ae53-c27b-447a-b0fe-0cb7d9cfeaa9',
                        title: 'Introduction to Computer Science I',
                        course_code: 'COMP 1405',
                        status: 'active',
                        goal: 80.0,
                        grade: 90.0,
                        deliverable_goal: 79.36,
                        api_v1_semester_id:
                            'c66d1814-aaf1-43c9-b222-a09feb14de08',
                        created_at: '2024-05-16T12:00:00.000Z',
                        updated_at: '2024-06-07T01:11:33.466Z',
                        api_v1_user_id: '0e343dd5-e335-409d-9a1f-a1c1fa57d488',
                    },
                ],
            },
            {
                id: 'd9418e32-1e7c-4f87-b6a0-01291c4d0162',
                name: 'Winter 2025',
                status: 'active',
                goal: 80.0,
                api_v1_user_id: '0e343dd5-e335-409d-9a1f-a1c1fa57d488',
                created_at: '2024-05-18T00:50:55.619Z',
                updated_at: '2024-05-18T00:50:55.619Z',
                courses: [],
            },
        ]);
    }),
    http.get('/api/v1/users/me/progress', ({ request, params, cookies }) => {
        const authtoken = request.headers
            .get('Authorization')
            ?.split(' ')
            .pop();
        if (!authtoken) {
            return HttpResponse.json(
                { message: 'Please log in' },
                { status: 401 }
            );
        }
        return HttpResponse.json([
            {
                semester: 'Fall 2024',
                semester_id: 'c66d1814-aaf1-43c9-b222-a09feb14de08',
                average: 90.0,
                num_courses: 1,
                goal: 80.0,
            },
            {
                semester: 'Winter 2025',
                semester_id: 'd9418e32-1e7c-4f87-b6a0-01291c4d0162',
                average: null,
                num_courses: 0,
                goal: 80.0,
            },
        ]);
    })
);

vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null,
        };
    },
}));

describe('Home', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });
    describe('when authenticated', () => {
        beforeEach(() => {
            vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
                data: {
                    session: {
                        access_token: userAccessToken(USER1),
                        refresh_token: 'TEST-TOKEN',
                        expires_in: 3000000000,
                        token_type: 'bearer',
                        user: USER1,
                    },
                },
                error: null,
            });
        });

        it('displays a friendly welcome', async () => {
            render(<Home />);
            await waitForElementToBeRemoved(() =>
                screen.queryByText('One sec...')
            );
            expect((await screen.findByText('Hey, friend!')).textContent)
                .toBeTruthy;
        });

        it('displays a loading screen initially', async () => {
            render(<Home />);
            expect((await screen.findByText('One sec...')).textContent)
                .toBeTruthy;
        });
    });
});
