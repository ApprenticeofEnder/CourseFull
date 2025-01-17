import { Course, Deliverable, Semester } from '@/types/data';

export interface SemesterDto extends Omit<Semester, 'courses'> {
    courses?: CourseDto[];
}

export interface CourseDto extends Omit<Course, 'deliverables'> {
    deliverables?: DeliverableDto[];
}

export interface ModifyCourseDto {
    api_v1_course: CourseDto;
}

export interface DeliverableDto
    extends Omit<Omit<Deliverable, 'start_date'>, 'deadline'> {
    start_date: string;
    deadline: string;
}

export interface PaymentLinkDto {
    redirect: string;
}
