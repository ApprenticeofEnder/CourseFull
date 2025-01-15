'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChildrenProps } from '@/types';

function QueryContext({ children }: ChildrenProps) {
    const [client] = useState(new QueryClient());

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default QueryContext;
