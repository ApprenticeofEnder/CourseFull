'use client';

// Error boundaries must be Client Components
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

import Button from '@/components/Button/Button';
import Spacer from '@/components/Ui/Spacer';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // TODO: Make more specific error handling (isolate axios errors, etc.)

    useEffect(() => {
        // Log the error to an error reporting service
        console.log(isAxiosError(error));
        console.error(error);
    }, [error]);

    return (
        <Spacer>
            <div>
                <h2>Something went wrong!</h2>
                <p>{error.message}</p>
                <Button
                    onPress={
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
