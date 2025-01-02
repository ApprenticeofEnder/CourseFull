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

export interface ViewableProps {
    handleView: () => void;
}

export interface ExitProps {
    handleExit: () => void;
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

export interface BasicFormProps {
    setIsValid: Dispatcher<boolean>;
}

export interface CourseFormProps extends BasicFormProps {
    course: Course;
    setCourse: Dispatcher<Course>;
}

export interface DeliverableFormProps extends BasicFormProps {
    deliverable: Deliverable;
    setDeliverable: Dispatcher<Deliverable>;
}

export interface SemesterFormProps extends BasicFormProps {
    semester: Semester;
    setSemester: Dispatcher<Semester>;
}

export interface CourseMultiCreateProps extends SemesterFormProps {
    coursesRemaining: number;
    setCoursesRemaining: Dispatcher<number>;
    userData: User;
    loadingUserData: boolean;
}
