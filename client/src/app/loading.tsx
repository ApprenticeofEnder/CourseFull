import { Spinner } from "@heroui/react";

import { LoadingProps } from '@/types';

export default function Loading({ message }: LoadingProps) {
    return (
        <div className="w-full flex justify-center">
            <Spinner label={message} className="mx-auto"></Spinner>
        </div>
    );
}