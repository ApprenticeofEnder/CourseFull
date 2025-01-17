import { ZonedDateTime } from '@internationalized/date';

import { ItemStatus } from '@/types/enums';

export interface BaseAcademicItem {
    id?: string;
    api_v1_user_id?: string;
    status: ItemStatus;
}

export interface Semester extends BaseAcademicItem {
    name: string;
    goal: number;
    courses: Course[];
}

export interface Course extends BaseAcademicItem {
    title: string;
    course_code: string;
    api_v1_semester_id?: string;
    goal?: number;
    grade?: number;
    deliverable_goal?: number;
    deliverables: Deliverable[];
}

export interface Deliverable extends BaseAcademicItem {
    name: string;
    weight: number;
    mark: number;
    notes: string;
    start_date: ZonedDateTime;
    deadline: ZonedDateTime;
    api_v1_course_id?: string;
    goal?: number;
}

export type Saved<T extends BaseAcademicItem> = T & {
    id: string;
    api_v1_user_id: string;
};

export type SavedDeliverable = Saved<Deliverable> & {
    api_v1_course_id: string;
    goal: number;
};
export type SavedCourse = Saved<Course> & {
    api_v1_semester_id: string;
    deliverables: SavedDeliverable[];
    grade: number;
    goal: number;
};
export type SavedSemester = Saved<Semester> & {
    courses: SavedCourse[];
    graded_courses?: GradedCourse[];
};

export type GradedCourse = SavedCourse & {
    graded_deliverables: number;
};

export interface CourseFullUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    supabase_id: string;
    courses_remaining?: number;
    subscribed: boolean;
}

export interface Product {
    name: string;
    description: string;
    stripe_id: string;
    stripe_price: string;
    price: number;
}

export interface GradeColours {
    bgColour: string;
    textColour: string;
}

export interface SemesterProgressType {
    semester: string;
    semester_id: string;
    average: number;
    num_courses: number;
    num_graded_courses: number;
    goal: number;
    status: ItemStatus;
    grade_colour?: GradeColours;
}

export interface BasicUserData {
    first_name: string;
    last_name: string;
    email: string;
    subscribed: boolean;
    supabase_id?: string;
}
