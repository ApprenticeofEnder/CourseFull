import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';

import {
    DeliverableDto,
    Deliverable,
    CourseDto,
    Course,
    SemesterDto,
    Semester,
} from '@coursefull';

export function convertSemesterDto(dto: SemesterDto): Semester {
    const courseDtos: CourseDto[] = dto.courses || [];
    const courses: Course[] = courseDtos.map(
        convertCourseDto
    );
    const semester: Semester = {
        ...dto,
        courses
    }
    return semester;
}

export function convertCourseDto(dto: CourseDto): Course {
    const deliverableDtos: DeliverableDto[] = dto.deliverables || [];
    const deliverables: Deliverable[] = deliverableDtos.map(
        convertDeliverableDto
    );
    const course: Course = {
        ...dto,
        deliverables,
    };

    return course;
}

export function convertDeliverableDto(dto: DeliverableDto): Deliverable {
    const start_date = parseAbsolute(dto.start_date, getLocalTimeZone());
    const deadline = parseAbsolute(dto.deadline, getLocalTimeZone());
    return {
        ...dto,
        start_date,
        deadline,
    };
}
