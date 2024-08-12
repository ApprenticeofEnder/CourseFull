import axios from 'axios';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
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

import * as helpers from '@lib/helpers';
import { ItemStatus, Endpoints } from '@coursefull';
import { makeSession, USER1, USER2, jwtDecode } from '@vitest.setup';

const NEW_USER = {
    first_name: 'Blah',
    last_name: 'Blah',
    email: 'test53@test.com',
    supabase_id: '5705f31b-2ac8-45a7-83a5-3934bcf48b98',
};

const server = setupServer(
    http.get(Endpoints.API_PROGRESS, async ({ request, params, cookies }) => {
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
    }),
    http.post(Endpoints.API_USER, async () => {
        return HttpResponse.json({
            ...NEW_USER,
            id: '15ddcca4-7cdb-4faa-ba64-e758d5614191',
            courses_remaining: 3,
            created_at: '2024-07-02T18:08:24.914Z',
            updated_at: '2024-07-02T18:08:24.914Z',
        });
    })
);

describe('Helper Function', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('ReadableStatus', () => {
        it('Should return the correct status for each input', () => {
            expect(helpers.ReadableStatus(ItemStatus.NOT_STARTED)).toEqual(
                'Not started'
            );
            expect(helpers.ReadableStatus(ItemStatus.ACTIVE)).toEqual('Active');
            expect(helpers.ReadableStatus(ItemStatus.COMPLETE)).toEqual(
                'Completed'
            );
        });
    });

    describe('determineGradeTextColour', () => {
        const GOAL = 80;
        it('Should be green if the goal is met', () => {
            expect(helpers.determineGradeTextColour(GOAL, 80)).toEqual(
                'text-success-500'
            );
        });

        it('Should be green if the goal is exceeded', () => {
            expect(helpers.determineGradeTextColour(GOAL, 90)).toEqual(
                'text-success-500'
            );
        });

        it('Should be yellow if the grade is below the goal, within 5%', () => {
            expect(helpers.determineGradeTextColour(GOAL, 77)).toEqual(
                'text-warning-500'
            );
            expect(helpers.determineGradeTextColour(GOAL, 75)).toEqual(
                'text-warning-500'
            );
        });

        it('Should be red if the grade is below the goal, beyond 5%', () => {
            expect(helpers.determineGradeTextColour(GOAL, 74)).toEqual(
                'text-danger-400'
            );
            expect(helpers.determineGradeTextColour(GOAL, 60)).toEqual(
                'text-danger-400'
            );
        });
    });

    describe('authenticatedApiErrorHandler', () => {
        const session = makeSession(USER1);
        it('Should return axios data for a successful response', async () => {
            const apiResponse = await helpers.authenticatedApiErrorHandler(
                async (session) => {
                    const apiResponse = await axios.get(
                        Endpoints.API_PROGRESS,
                        {
                            headers: {
                                Authorization: `Bearer ${session.access_token}`,
                            },
                        }
                    );
                    return apiResponse;
                },
                session,
                (error) => {
                    console.error(error);
                }
            );
            expect(apiResponse.success).toBeTruthy();
            expect(apiResponse.response?.data.length).toEqual(2);
        });

        it('Should return an unsuccessful response on an invalid session', async () => {
            const apiResponse = await helpers.authenticatedApiErrorHandler(
                async (session) => {
                    const apiResponse = await axios.get(
                        Endpoints.API_PROGRESS,
                        {
                            headers: {
                                Authorization: `Bearer ${session.access_token}`,
                            },
                        }
                    );
                    return apiResponse;
                },
                null,
                (error) => {
                    expect(error.message).toEqual('Invalid session.');
                }
            );
            expect(apiResponse.success).toBeFalsy();
        });

        it('Should return an unsuccessful response when the api call throws an error', async () => {
            const apiResponse = await helpers.authenticatedApiErrorHandler(
                async (session) => {
                    throw new Error('TEST');
                },
                session,
                (error) => {
                    expect(error.message).toEqual('TEST');
                }
            );
            expect(apiResponse.success).toBeFalsy();
        });

        it('Should return an unsuccessful response when the api call throws an unconventional error', async () => {
            const fakeErrorObject = { error: 'Hello' };
            const apiResponse = await helpers.authenticatedApiErrorHandler(
                async (session) => {
                    throw fakeErrorObject;
                },
                session,
                (error) => {
                    expect(error.message).toEqual(
                        `This value was thrown as is, not through an Error: ${JSON.stringify(
                            fakeErrorObject
                        )}`
                    );
                }
            );
            expect(apiResponse.success).toBeFalsy();
        });
    });

    describe('apiErrorHandler', () => {
        it('Should return axios data for a successful response', async () => {
            const apiResponse = await helpers.apiErrorHandler(
                async () => {
                    const apiPostData = {
                        api_v1_user: NEW_USER,
                    };

                    const apiResponse = await axios.post(
                        Endpoints.API_USER,
                        apiPostData
                    );
                    return apiResponse;
                },
                (error) => {
                    throw error;
                }
            );
            expect(apiResponse.success).toBeTruthy();
            expect(apiResponse.response?.data.first_name).toEqual(
                NEW_USER.first_name
            );
        });
    });

    describe.skip('semesterURL', () => {});

    describe.skip('courseURL', () => {});

    describe('validatePassword', () => {
        it('Should not validate passwords that do not meet the requirements', () => {
            const invalidPasswords = [
                '123456',
                'qwerty',
                'AAAAARTGHJK',
                '!!!!!!!!',
                'Password11',
            ];

            for (let password of invalidPasswords) {
                expect(helpers.validatePassword(password)).toBeFalsy();
            }
        });

        it('Should only validate passwords with specific special characters', () => {
            const basePassword = 'Password1';
            const specialCharacters = '!#$%&? _"'.split('');
            for (let specialCharacter of specialCharacters) {
                const password = `${basePassword}${specialCharacter}`;
                expect(helpers.validatePassword(password)).toBeTruthy();
            }
        });
    });
});
