import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';

import {
    Course,
    CourseDto,
    Deliverable,
    DeliverableDto,
    Semester,
    SemesterDto,
} from '@/types';

export function convertSemesterFromDto(dto: SemesterDto): Semester {
    const courseDtos: CourseDto[] = dto.courses || [];
    const courses: Course[] = courseDtos.map(convertCourseFromDto);
    const semester: Semester = {
        ...dto,
        courses,
    };
    return semester;
}

export function convertCourseFromDto(dto: CourseDto): Course {
    const deliverableDtos: DeliverableDto[] = dto.deliverables || [];
    const deliverables: Deliverable[] = deliverableDtos.map(
        convertDeliverableFromDto
    );

    return {
        ...dto,
        deliverables,
    };
}

export function convertCourseToDto(data: Course): CourseDto {
    const deliverables: Deliverable[] = data.deliverables || [];
    const deliverableDtos: DeliverableDto[] = deliverables.map(
        convertDeliverableToDto
    );
    return {
        ...data,
        deliverables: deliverableDtos,
    };
}

export function convertDeliverableFromDto(dto: DeliverableDto): Deliverable {
    const start_date = parseAbsolute(dto.start_date, getLocalTimeZone());
    const deadline = parseAbsolute(dto.deadline, getLocalTimeZone());
    return {
        ...dto,
        start_date,
        deadline,
    };
}

export function convertDeliverableToDto(data: Deliverable): DeliverableDto {
    const start_date = data.start_date.toAbsoluteString();
    const deadline = data.deadline.toAbsoluteString();
    return {
        ...data,
        start_date,
        deadline,
    };
}
