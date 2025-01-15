import { RefObject } from "react";

export type HomePageRef = {
    ref: RefObject<HTMLDivElement>;
    scrollIntoView: () => void;
    navigateTo: () => void;
};

export interface HomePageRefs {
    benefitsRef: HomePageRef;
    callToValueRef: HomePageRef;
    faqRef: HomePageRef;
    featuresRef: HomePageRef;
    heroRef: HomePageRef;
    inActionRef: HomePageRef;
    mechanicsRef: HomePageRef;
    pricingRef: HomePageRef;
    resultsRef: HomePageRef;
    socialProofRef: HomePageRef;
}
