'use client';

import dynamic from 'next/dynamic';

import Hero from '@/components/Home/Hero';

const Benefits = dynamic(() => import('@/components/Home/Benefits'));
const CallToValue = dynamic(() => import('@/components/Home/CallToValue'));
const Faq = dynamic(() => import('@/components/Home/Faq'));
const Features = dynamic(() => import('@/components/Home/Features'));
const InAction = dynamic(() => import('@/components/Home/InAction'));
const MechanicsInfo = dynamic(() => import('@/components/Home/MechanicsInfo'));
const Pricing = dynamic(() => import('@/components/Home/Pricing'));
const Results = dynamic(() => import('@/components/Home/Results'));
const SocialProof = dynamic(() => import('@/components/Home/SocialProof'));

export default function HomePage() {
    return (
        <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col gap-8 lg:gap-16">
                <Hero />
                <Features />
                {/* <InAction /> */}
                <Benefits />
                <MechanicsInfo />
                <Faq />
                {/* TODO: Finish this page */}
                {/* <CallToValue /> */}
                {/* <Pricing /> */}
            </div>
        </div>
    );
}

