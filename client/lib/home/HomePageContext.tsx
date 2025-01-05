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
import { HomePageRef, HomePageRefs } from '@coursefull';

type HomePageRefOptions = {
    href: string;
};

function useHomePageRef(options?: HomePageRefOptions): HomePageRef {
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const result: HomePageRef = {
        ref,
        scrollIntoView: () => {
            ref.current?.scrollIntoView({ behavior: 'smooth' });
        },
        navigateTo: () => {},
    };
    if (options) {
        let { href } = options;
        return {
            ...result,
            navigateTo: () => {
                router.push(href!);
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

export function useHomePage(){
    return useContext(HomePageContext);
}

export default HomePageProvider;
