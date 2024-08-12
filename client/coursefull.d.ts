import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { ItemStatus } from '@/enums.d';

export interface ChildrenProps {
    children: ReactNode;
}

export interface ModalProps {
    open: boolean;
}

export interface SessionProps {
    session: Session;
}

export interface SpacerProps extends ChildrenProps {
    className?: string;
}

export interface SemesterProgressType {
    semester: string;
    semester_id: string;
    average: number;
    num_courses: number;
    goal: number;
    status: ItemStatus;
    grade_colour?: string;
}

export interface BaseAcademicItem {
    id?: string;
    api_v1_user_id?: string;
    status: ItemStatus;
}

export interface Semester extends BaseAcademicItem {
    name: string;
    goal: number;
    courses?: Course[];
}

export interface Course extends BaseAcademicItem {
    title: string;
    course_code: string;
    api_v1_semester_id: string;
    goal?: number;
    grade?: number;
    deliverable_goal?: number;
    deliverables?: Deliverable[];
}

export interface Deliverable extends BaseAcademicItem {
    name: string;
    weight: number;
    mark: number;
    notes: string;
    api_v1_course_id?: string;
    goal?: number;
}

export interface APIServiceResponse {
    response?: AxiosResponse;
    success: boolean;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    supabase_id: string;
    courses_remaining: number;
}

export interface Product {
    name: string;
    description: string;
    stripe_id: string;
    stripe_price: string;
    price: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartState {
    items: {
        [stripe_id: string]: CartItem;
    };
    total?: number;
}

export type CartAction =
    | { type: 'ADD_PRODUCT'; payload: CartItem }
    | { type: 'UPDATE_PRODUCT'; payload: CartItem }
    | { type: 'REMOVE_PRODUCT'; payload: string }
    | { type: 'INIT_STATE'; payload: CartState }
    | { type: 'WIPE_CART' };

export * from '@/enums.d';
