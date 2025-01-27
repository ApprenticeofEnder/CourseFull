import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';

import {
    Course,
    CourseDto,
    Deliverable,
    DeliverableDto,
    SavedCourse,
    SavedDeliverable,
    SavedSemester,
    Semester,
    SemesterDto,
} from '@/types';

export function convertSemesterFromDto(dto: SemesterDto): SavedSemester {
    const courseDtos: CourseDto[] = dto.courses || [];
    const courses: SavedCourse[] = courseDtos.map(convertCourseFromDto);
    const semester: SavedSemester = {
        ...dto,
        courses,
    } as SavedSemester;
    return semester;
}

export function convertCourseFromDto(dto: CourseDto): SavedCourse {
    const deliverableDtos: DeliverableDto[] = dto.deliverables || [];
    const deliverables: SavedDeliverable[] = deliverableDtos.map(
        convertDeliverableFromDto
    );

    return {
        ...dto,
        deliverables,
    } as SavedCourse;
}

export function convertCourseToDto(data: Course): CourseDto {
    const deliverables: Deliverable[] = [];
    const deliverableDtos: DeliverableDto[] = deliverables.map(
        convertDeliverableToDto
    );
    return {
        ...data,
        deliverables: deliverableDtos,
    };
}

export function convertDeliverableFromDto(
    dto: DeliverableDto
): SavedDeliverable {
    const start_date = parseAbsolute(dto.start_date, getLocalTimeZone());
    const deadline = parseAbsolute(dto.deadline, getLocalTimeZone());
    return {
        ...dto,
        start_date,
        deadline,
    } as SavedDeliverable;
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
