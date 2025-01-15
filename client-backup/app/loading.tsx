import { Spinner } from '@nextui-org/react';

import { LoadingProps } from '@coursefull';

export default function Loading({ message }: LoadingProps) {
    return (
        <div className="w-full flex justify-center">
            <Spinner label={message} className="mx-auto"></Spinner>
        </div>
    );
}
