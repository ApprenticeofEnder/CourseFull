import { ChildrenProps } from '@coursefull';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up - CourseFull',
};

export default function SignupLayout({ children }: ChildrenProps){
    return children;
}