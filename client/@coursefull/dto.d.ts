import { Semester, Course, Deliverable, Product } from './data';

export interface SemesterDto extends Semester {
    courses?: CourseDto[];
}

export interface CourseDto extends Course {
    deliverables?: DeliverableDto[];
}

export interface ModifyCourseDto {
    api_v1_course: CourseDto
}

export interface DeliverableDto extends Deliverable {
    start_date: string;
    deadline: string;
}

export interface PaymentLinkDto {
    redirect: string;
}