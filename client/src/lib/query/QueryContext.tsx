'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { ChildrenProps } from '@/types';

function QueryContext({ children }: ChildrenProps) {
    const [client] = useState(new QueryClient());

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default QueryContext;
