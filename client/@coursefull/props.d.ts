import { Session } from '@supabase/supabase-js';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
    Semester,
    Course,
    Deliverable,
    UpdatedDeliverable,
    User,
} from './data.d';
import { ZodError } from 'zod';

export type Dispatcher<T> = Dispatch<SetStateAction<T>>;

export interface ChildrenProps {
    children: ReactNode;
}

export interface ModalProps {
    open: boolean;
}

export interface SessionProps {
    session: Session;
}

export interface UserDataProps {
    userData: User;
}

export interface SpacerProps extends ChildrenProps {
    className?: string;
}

export interface LoadingProps {
    message?: string;
}

export interface EditableProps {
    handleEdit: () => void;
}

export interface DeletableProps {
    handleDelete: () => void;
}

export interface UpdateDeliverableModalProps extends SessionProps {
    deliverable: UpdatedDeliverable | null;
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

export interface CourseFormProps {
    course: Course;
    setCourse: Dispatcher<Course>;
}

export interface DeliverableFormProps {
    deliverable: Deliverable;
    setDeliverable: Dispatcher<Deliverable>;
}

export interface SemesterFormProps {
    semester: Semester;
    setSemester: Dispatcher<Semester>;
}

export interface CourseMultiCreateProps extends SemesterFormProps {
    coursesRemaining: number;
    setCoursesRemaining: Dispatcher<number>;
    userData: User;
    loadingUserData: boolean;
}
