import {
    AuthHeaders,
    Course,
    Deliverable,
    Endpoints,
    ItemStatus,
    Semester,
} from '@coursefull';
import { faker } from '@faker-js/faker';
import { supabase } from '@lib/supabase';
import { createRegisteredUser, deleteData } from '@lib/test-helpers';
import { DEMO_ACCOUNT_DATA } from '@vitest.setup';
import axios, { AxiosRequestConfig } from 'axios';
import { connect } from 'ts-postgres';
import { it } from 'vitest';

const COURSE_DATA = [
    { title: 'Introduction to Computer Science', course_code: 'CS101' },
    { title: 'Calculus I', course_code: 'MATH100' },
    { title: 'General Chemistry', course_code: 'CHEM101' },
    { title: 'Introduction to Psychology', course_code: 'PSY101' },
    { title: 'World History: 1500-Present', course_code: 'HIST102' },
    { title: 'Microeconomics', course_code: 'ECON201' },
    { title: 'Principles of Accounting', course_code: 'ACCT200' },
    { title: 'Organic Chemistry I', course_code: 'CHEM250' },
    { title: 'Introduction to Philosophy', course_code: 'PHIL101' },
    { title: 'Foundations of Physics', course_code: 'PHYS105' },
    { title: 'Human Anatomy and Physiology', course_code: 'BIOL210' },
    { title: 'Introduction to Literature', course_code: 'ENGL110' },
    { title: 'Environmental Science', course_code: 'ENV101' },
    { title: 'Introduction to Sociology', course_code: 'SOC101' },
    { title: 'Data Structures and Algorithms', course_code: 'CS200' },
    { title: 'Public Speaking', course_code: 'COMM101' },
    { title: 'Digital Marketing', course_code: 'MKTG220' },
    { title: 'Business Ethics', course_code: 'BUS303' },
    { title: 'Spanish I', course_code: 'SPAN101' },
    { title: 'Introduction to Political Science', course_code: 'POLS100' },
];

const MARK_RANGE = { min: 80, max: 100 };

async function populateSemester(
    semester: Semester,
    api_v1_semester_id: string,
    headers: Partial<AuthHeaders>
) {
    let courseStatus;

    switch (semester.status) {
        case ItemStatus.COMPLETE:
            courseStatus = ItemStatus.COMPLETE;
            break;
        default:
            courseStatus = ItemStatus.ACTIVE;
    }
    const axiosCreateOptions: AxiosRequestConfig = {
        headers,
        validateStatus: (status) => status === 201,
    };

    const courseSelections = faker.helpers.arrayElements(COURSE_DATA, {
        min: 3,
        max: 5,
    });

    for (let courseSelection of courseSelections) {
        const course: Course = {
            ...courseSelection,
            status: courseStatus,
            api_v1_semester_id,
        };
        const postData = {
            api_v1_course: course,
        };
        const response = await axios.post(
            `${process.env.APP_URL}${Endpoints.API_COURSES}`,
            postData,
            axiosCreateOptions
        );
        const course_id = response.data.id;
        await populateCourse(course, course_id, semester.status, headers);
    }
}

async function populateCourse(
    course: Course,
    api_v1_course_id: string,
    semesterStatus: ItemStatus,
    headers: Partial<AuthHeaders>
) {
    const assignmentTotalWeight: number = 40;
    const tutorialTotalWeight: number = 10;
    const midtermWeight: number = 20;
    const finalExamWeight: number = 30;

    const numberOfAssignments = faker.number.int({ min: 1, max: 5 });
    const numberOfTutorials = faker.number.int({ min: 3, max: 12 });

    const assignmentWeight = assignmentTotalWeight / numberOfAssignments;
    const tutorialWeight = tutorialTotalWeight / numberOfTutorials;

    const baseDeliverable = {
        notes: '',
        api_v1_course_id,
    };

    const axiosCreateOptions: AxiosRequestConfig = {
        headers,
        validateStatus: (status) => status === 201,
    };

    let assignmentsCompleted = numberOfAssignments;
    let tutorialsCompleted = numberOfTutorials;
    let midtermCompleted = true;
    let finalCompleted = false;

    switch (semesterStatus) {
        case ItemStatus.NOT_STARTED:
            assignmentsCompleted = 0;
            tutorialsCompleted = 0;
            midtermCompleted = false;
            break;
        case ItemStatus.ACTIVE:
            assignmentsCompleted = numberOfAssignments / 2;
            tutorialsCompleted = numberOfTutorials / 2;
            break;
        case ItemStatus.COMPLETE:
            finalCompleted = true;
            break;
    }

    const deliverables: Deliverable[] = [];

    for (let i = 0; i < numberOfAssignments; i++) {
        const assignment = createAssignment(
            i,
            assignmentsCompleted,
            assignmentWeight,
            baseDeliverable
        );
        deliverables.push(assignment);
    }

    for (let i = 0; i < numberOfTutorials; i++) {
        const tutorial = createTutorial(
            i,
            tutorialsCompleted,
            tutorialWeight,
            baseDeliverable
        );
        deliverables.push(tutorial);
    }

    const midterm = createExam(
        'Midterm',
        midtermCompleted,
        midtermWeight,
        baseDeliverable
    );

    const finalExam = createExam(
        'Final Exam',
        finalCompleted,
        finalExamWeight,
        baseDeliverable
    );

    deliverables.push(midterm);
    deliverables.push(finalExam);

    for (let deliverable of deliverables) {
        const postData = {
            api_v1_deliverable: deliverable,
        };
        const response = await axios.post(
            `${process.env.APP_URL}${Endpoints.API_DELIVERABLES}`,
            postData,
            axiosCreateOptions
        );
    }
}

function createAssignment(
    i: number,
    assignmentsCompleted: number,
    assignmentWeight: number,
    baseDeliverable: { notes: string; api_v1_course_id: string }
) {
    let mark = 0;
    let status = ItemStatus.ACTIVE;
    if (i < assignmentsCompleted) {
        status = ItemStatus.COMPLETE;
        mark = faker.number.float(MARK_RANGE);
    }
    const assignment: Deliverable = {
        name: `Assignment ${i + 1}`,
        status,
        weight: assignmentWeight,
        mark,
        ...baseDeliverable,
    };
    return assignment;
}

function createTutorial(
    i: number,
    tutorialsCompleted: number,
    tutorialWeight: number,
    baseDeliverable: { notes: string; api_v1_course_id: string }
) {
    let mark = 0;
    let status = ItemStatus.ACTIVE;
    if (i < tutorialsCompleted) {
        status = ItemStatus.COMPLETE;
        mark = faker.number.float(MARK_RANGE);
    }
    const assignment: Deliverable = {
        name: `Tutorial ${i + 1}`,
        status,
        weight: tutorialWeight,
        mark,
        ...baseDeliverable,
    };
    return assignment;
}

function createExam(
    name: string,
    completed: boolean,
    weight: number,
    baseDeliverable: { notes: string; api_v1_course_id: string }
) {
    let mark = 0;
    let status = ItemStatus.ACTIVE;
    if (completed) {
        mark = faker.number.float(MARK_RANGE);
        status = ItemStatus.COMPLETE;
    }
    const exam: Deliverable = {
        name,
        status,
        weight,
        mark,
        ...baseDeliverable,
    };
    return exam;
}

it(
    'Populate demo data',
    async () => {
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        const dbConnectionDetails = {
            user: 'postgres',
            password: 'postgres',
            database: 'postgres',
            port: 54322,
        };

        // populate user data
        await (async () => {
            const dbClient = await connect(dbConnectionDetails);
            await deleteData(dbClient);
            const userData = await createRegisteredUser(
                dbClient,
                DEMO_ACCOUNT_DATA
            );
            await dbClient.query(
                `UPDATE api_v1_users SET courses_remaining = 500`
            );
            await dbClient.end();
        })();

        const { error, data } = await supabase.auth.signInWithPassword(
            DEMO_ACCOUNT_DATA
        );

        const { session } = data;

        const headers: Partial<AuthHeaders> = {
            Authorization: `Bearer ${session?.access_token}`,
        };

        const semesters: Semester[] = [
            { name: 'Fall 2023', goal: 90, status: ItemStatus.COMPLETE },
            { name: 'Winter 2024', goal: 90, status: ItemStatus.COMPLETE },
            { name: 'Fall 2024', goal: 90, status: ItemStatus.ACTIVE },
            { name: 'Winter 2025', goal: 90, status: ItemStatus.NOT_STARTED },
        ];

        try {
            for (let semester of semesters) {
                const axiosCreateOptions: AxiosRequestConfig = {
                    headers,
                    validateStatus: (status) => status === 201,
                };
                const postData = {
                    api_v1_semester: semester,
                };
                const response = await axios.post(
                    `${process.env.APP_URL}${Endpoints.API_SEMESTERS}`,
                    postData,
                    axiosCreateOptions
                );

                const semester_id = response.data.id;
                await populateSemester(semester, semester_id, headers);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
        console.log(session);
    },
    { timeout: 10000 }
);
