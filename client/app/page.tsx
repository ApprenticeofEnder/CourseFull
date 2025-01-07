'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import Hero from '@components/Home/Hero';
import { useSession } from '@lib/supabase/SessionContext';
import { Endpoints } from '@coursefull';

const Benefits = dynamic(() => import('@components/Home/Benefits'));
const CallToValue = dynamic(() => import('@components/Home/CallToValue'));
const Faq = dynamic(() => import('@components/Home/Faq'));
const Features = dynamic(() => import('@components/Home/Features'));
const InAction = dynamic(() => import('@components/Home/InAction'));
const MechanicsInfo = dynamic(() => import('@components/Home/MechanicsInfo'));
const Pricing = dynamic(() => import('@components/Home/Pricing'));
const Results = dynamic(() => import('@components/Home/Results'));
const SocialProof = dynamic(() => import('@components/Home/SocialProof'));

export default function HomePage() {
    const router = useRouter();
    const { session, loadingSession } = useSession();

    useEffect(() => {
        if (!session) {
            return;
        }
        router.push(Endpoints.DASHBOARD);
    }, [session, loadingSession, router]);

    return (
        <div className="flex flex-col justify-center w-full">
            <div className="flex flex-col gap-8 lg:gap-16">
                <Hero />
                <Features />
                {/* <InAction /> */}
                <Benefits />
                <MechanicsInfo />
                <Faq />
                <CallToValue />
                {/* <Pricing /> */}
            </div>
        </div>
    );
}
