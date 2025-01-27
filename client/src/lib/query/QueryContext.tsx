'use client';

import {
    QueryClient,
    QueryClientProvider,
    isServer,
} from '@tanstack/react-query';

import { ChildrenProps } from '@/types';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

function QueryContext({ children }: ChildrenProps) {
    const client = getQueryClient();

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default QueryContext;
