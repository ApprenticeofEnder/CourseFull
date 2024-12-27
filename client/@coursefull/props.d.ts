import { Session } from '@supabase/supabase-js';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import { Semester, Course, Deliverable, UpdatedDeliverable, User } from "./data.d";
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
    userData: User | null;
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

export interface CourseFormProps {
    course: Course,
    setCourse: Dispatcher<Course>
}

export interface DeliverableFormProps extends ZodErrorProps {
    deliverable: Deliverable;
    setDeliverable: Dispatcher<Deliverable>;
}

export interface SemesterFormProps {
    name: string;
    setName: (name: string) => void;
    status: ItemStatus;
    setStatus: (name: ItemStatus) => void;
    goal: string;
    setGoal: (name: string) => void;
}

export interface CourseMultiCreateProps {
    courses: Partial<Course[]>;
    setCourses: (courses: Partial<Course[]>) => void;
    coursesRemaining: number;
    setCoursesRemaining: (coursesRemaining: number) => void;
    userData: User;
    loadingUserData: boolean;
}