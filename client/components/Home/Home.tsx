'use client';

import { ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HomePageRefs } from '@coursefull';
import Hero from '@components/Home/Hero';

import { useHomePage } from '@lib/home/HomePageContext';

const Benefits = dynamic(() => import('@components/Home/Benefits'));
const CallToValue = dynamic(()=>import('@components/Home/CallToValue'));
const Faq = dynamic(()=>import('@components/Home/Faq'));
const Features = dynamic(() => import('@components/Home/Features'));
const InAction = dynamic(()=>import('@components/Home/InAction'));
const MechanicsInfo = dynamic(() => import('@components/Home/MechanicsInfo'));
const Pricing = dynamic(() => import('@components/Home/Pricing'));
const Results = dynamic(() => import('@components/Home/Results'));
const SocialProof = dynamic(() => import('@components/Home/SocialProof'));

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

    return (
        <div className="flex flex-col gap-8 lg:gap-16">
            <Hero />
            <Features />
            <Benefits />
            <MechanicsInfo />
            <Pricing />
        </div>
    );
}
