'use client';
import { isAxiosError, AxiosError } from 'axios';
import { Atkinson_Hyperlegible } from 'next/font/google';

const atkinsonHyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export default function GlobalError({
    error,
    reset,
}: {
    error: (Error | AxiosError) & { digest?: string };
    reset: () => void;
}) {
    console.log(isAxiosError(error));

    return (
        // global-error must include html and body tags
        <html lang="en">
            <body className={atkinsonHyperlegible.className}>
                <h2>Something went wrong!</h2>
                <p>{error.message}</p>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
