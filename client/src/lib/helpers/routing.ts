import { Endpoints, SavedCourse, SavedSemester } from '@/types';

export function semesterUrl(semester: SavedSemester) {
    return `${Endpoints.Page.SEMESTERS}/${semester.id}`;
}

export function courseUrl(course: SavedCourse) {
    return `${Endpoints.Page.COURSES}/${course.id}`;
}
