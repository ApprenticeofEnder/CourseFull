import { Endpoints, SavedCourse, SavedSemester } from '@/types';

export function semesterUrl(semester: SavedSemester) {
    return `${Endpoints.Page.SEMESTERS}/${semester.id}`;
}

export function semesterUrlFromCourse(course: SavedCourse) {
    return `${Endpoints.Page.SEMESTERS}/${course.api_v1_semester_id}`;
}

export function courseUrl(course: SavedCourse) {
    return `${Endpoints.Page.COURSES}/${course.id}`;
}
