'use client';

import dynamic from 'next/dynamic';
import { HomePageProps } from '@coursefull/props';
import Hero from '@components/Home/Hero';
import { ReactNode, useRef } from 'react';

const Benefits = dynamic(() => import('@components/Home/Benefits'));
const CallToValue = dynamic(()=>import('@components/Home/CallToValue'));
const Features = dynamic(() => import('@components/Home/Features'));
const MechanicsInfo = dynamic(() => import('@components/Home/MechanicsInfo'));
const Pricing = dynamic(() => import('@components/Home/Pricing'));

/**
 * Header:
 * - Tracking grades alone is out, tracking goals is in.
 * - Why only reflect on the past when school is about your future?
 * - School is a marathon, not a walk-and-then-sprint-the-last-200-meters-a-thon.
 * - Last minute exam anxiety is so last year.
 * - Know what you need to get on the final -- and everything else -- from minute one.
 *
 * Body:
 * - Instead of relying on grades, math, and chaotic spreadsheets to track your academic goals, let us do the math. CourseFull lets you focus on your coursework while knowing just how much breathing room you have, or by how much you need to catch up.
 * - CourseFull tracks your grades, and what you need to achieve your goals, all semester long.
 */

export default function Home() {
    const useHomepageRef = () => useRef<HTMLDivElement>(null);
    const refs: HomePageProps = {
        benefitsRef: useHomepageRef(),
        callToValueRef: useHomepageRef(),
        faqRef: useHomepageRef(),
        featuresRef: useHomepageRef(),
        heroRef: useHomepageRef(),
        inActionRef: useHomepageRef(),
        mechanicsRef: useHomepageRef(),
        pricingRef: useHomepageRef(),
        resultsRef: useHomepageRef(),
        socialProofRef: useHomepageRef()
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-8 lg:gap-16">
            <Hero {...refs} />
            <Features {...refs}/>
            <MechanicsInfo {...refs} />
            <Pricing />
        </div>
    );
}
