'use client';

import { Endpoints } from '@coursefull';
import LinkButton from '@components/Button/LinkButton';
import Button from '@components/Button/Button';
import { ClipboardIcon, UserIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

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

export default function AnonHome() {
    return (
        <div className="flex justify-between">
            <div className="basis-1/2">
                <h1 className="text-left text-5xl">
                    Last minute exam anxiety is out.
                </h1>
                <h1 className="text-left text-5xl">
                    <b>Tracking goals is in.</b>
                </h1>
                <p className="text-2xl my-5">
                    CourseFull tracks your grades, and what you need to achieve
                    your goals, all semester long.
                </p>
                <blockquote className="p-4 my-4 border-s-4 border-background-300">
                    <p className="text-xl italic font-medium leading-relaxed">
                        {
                            "It's not what we do once in a while that shapes our lives. It's what we do consistently."
                        }
                    </p>
                    <p>~ Tony Robbins</p>
                </blockquote>
            </div>

            <div className="basis-1/2 flex flex-col gap-8 justify-center">
                <div className="w-3/4 ms-auto me-2">
                    <LinkButton
                        href={Endpoints.LOGIN}
                        className="w-full"
                        data-testid="home-login"
                        endContent={<UserIcon className="w-6 h-6"></UserIcon>}
                    >
                        Login
                    </LinkButton>
                </div>
                <div className="w-3/4 ms-auto me-2">
                    <LinkButton
                        href={Endpoints.SIGN_UP}
                        className="w-full"
                        data-testid="home-signup"
                        endContent={
                            <ClipboardIcon className="w-6 h-6"></ClipboardIcon>
                        }
                    >
                        Sign Up
                    </LinkButton>
                </div>
                <div className="w-3/4 ms-auto me-2">
                    <Button
                        className="w-full"
                        data-testid="home-learn-more"
                        endContent={
                            <InformationCircleIcon className="w-6 h-6"></InformationCircleIcon>
                        }
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
}
