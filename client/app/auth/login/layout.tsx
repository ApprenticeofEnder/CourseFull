import { ChildrenProps } from "@coursefull";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Log In - CourseFull',
};

export default function LoginLayout({ children }: ChildrenProps){
    return children;
}