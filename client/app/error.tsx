'use client'; // Error boundaries must be Client Components

import Spacer from '@components/Spacer';
import Button from '@components/Button/Button';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    console.log(isAxiosError(error));

    return (
        <Spacer>
            <div>
                <h2>Something went wrong!</h2>
                <p>{error.message}</p>
                <Button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                >
                    Try again
                </Button>
            </div>
        </Spacer>
    );
}
