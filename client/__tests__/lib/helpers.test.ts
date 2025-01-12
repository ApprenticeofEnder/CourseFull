import axios, { AxiosError } from 'axios';
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
    }),
    http.get('/404', async () => {
        return HttpResponse.json(
            {
                message: 'Not found.',
            },
            { status: 404 }
        );
    }),
    http.post('/404', async () => {
        return HttpResponse.json(
            {
                message: 'Not found.',
            },
            { status: 404 }
        );
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
        it('Should return data for a successful response', async () => {
            const { data } = await helpers.authenticatedApiHandler(
                async (session, headers) => {
                    const apiResponse = await axios.get(
                        Endpoints.API_PROGRESS,
                        {
                            headers,
                        }
                    );
                    return apiResponse;
                },
                session
            );
            expect(data.length).toEqual(2);
        });

        it('Should throw an error on an invalid session', async () => {
            expect(
                await helpers.authenticatedApiHandler(
                    async (session, headers) => {
                        const apiResponse = await axios.get(
                            Endpoints.API_PROGRESS,
                            {
                                headers,
                            }
                        );
                        return apiResponse;
                    },
                    null
                )
            ).toThrowError();
        });

        it('Should throw an error when the api call throws an error', async () => {
            expect(
                await helpers.authenticatedApiHandler(async (session) => {
                    throw new Error('TEST');
                }, session)
            ).toThrowError('TEST');
        });

        it('Should throw an AxiosError when Axios encounters a bad status code', async () => {
            expect(
                await helpers.authenticatedApiHandler(async (session, headers) => {
                    const apiResponse = await axios.get('/404', {
                        headers,
                    });
                    return apiResponse;
                }, session)
            ).toThrowError();
        });
    });

    describe('apiErrorHandler', () => {
        it('Should return axios data for a successful response', async () => {
            const {data}= await helpers.apiHandler(
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
            );
            expect(data.first_name).toEqual(
                NEW_USER.first_name
            );
        });

        it('Should throw an AxiosError when Axios encounters a bad status code', async () => {
            expect(
                await helpers.apiHandler(
                    async () => {
                        const apiResponse = await axios.get('/404', {
                            validateStatus: (status) => {
                                return status === 200;
                            },
                        });
                        return apiResponse;
                    }
                )
            ).toThrowError();
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

            for (let password in invalidPasswords) {
                const result = helpers.validatePassword(password);
                console.log(password, result);
                expect(result).toBeFalsy();
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
