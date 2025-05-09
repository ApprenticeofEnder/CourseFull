'use client';

import assert from 'assert';
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Endpoints, HomePageRef, HomePageRefs } from '@coursefull';

type HomePageRefOptions = {
    href: string;
};

function useHomePageRef(options?: HomePageRefOptions): HomePageRef {
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const scrollIntoView = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const result: HomePageRef = {
        ref,
        scrollIntoView,
        navigateTo: async () => {
            if (window.location.pathname !== Endpoints.ROOT) {
                router.push(Endpoints.ROOT);
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
            }
            scrollIntoView();
        },
    };
    if (options) {
        let { href } = options;
        return {
            ...result,
            navigateTo: async () => {
                if (window.location.pathname !== Endpoints.ROOT) {
                    router.push(href!);
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                }
                scrollIntoView();
            },
        };
    }
    return result;
}

export const HomePageContext = createContext<{
    refs: HomePageRefs | null;
}>({ refs: null });

const HomePageProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const refs: HomePageRefs = {
        benefitsRef: useHomePageRef(),
        callToValueRef: useHomePageRef(),
        faqRef: useHomePageRef(),
        featuresRef: useHomePageRef(),
        heroRef: useHomePageRef(),
        inActionRef: useHomePageRef(),
        mechanicsRef: useHomePageRef(),
        pricingRef: useHomePageRef(),
        resultsRef: useHomePageRef(),
        socialProofRef: useHomePageRef(),
    };

    return (
        <HomePageContext.Provider value={{ refs }}>
            {children}
        </HomePageContext.Provider>
    );
};

export function useHomePage() {
    return useContext(HomePageContext);
}

export default HomePageProvider;
