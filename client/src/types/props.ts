import { ModalProps as BaseModalProps } from '@heroui/react';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { ZodError } from 'zod';

import { Course, CourseFullUser, Deliverable, Semester } from '@/types/data';

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;

export interface ChildrenProps {
    children: ReactNode;
}

export interface LoadingProps {
    message?: string;
}

export interface AnimateOnScrollProps extends ChildrenProps {
    delay: number;
}

export interface ZodErrorProps {
    zodError: ZodError | null;
}

export interface FormProps<T> {
    data: T;
    setData: Dispatcher<T>;
}

export interface BasicFormProps {
    setIsValid?: Dispatcher<boolean>;
}

export interface CourseFormProps extends BasicFormProps {
    course: Course;
    setCourse: Dispatcher<Course>;
}

export interface DeliverableFormProps extends BasicFormProps {
    deliverable: Deliverable;
    setDeliverable: Dispatcher<Deliverable>;
    totalWeight: number;
}

export interface SemesterFormProps extends BasicFormProps {
    semester: Semester;
    setSemester: Dispatcher<Semester>;
}

export interface CourseMultiCreateProps extends SemesterFormProps {
    coursesRemaining: number;
    setCoursesRemaining: Dispatcher<number>;
    userData: CourseFullUser;
    loadingUserData: boolean;
}
