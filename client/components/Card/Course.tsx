'use client';

import {
    ReadableStatus,
    classNames,
    courseURL,
    determineGradeBGColour,
} from '@lib/helpers';
import { Course } from '@coursefull';
import LinkButton from '../Button/LinkButton';
import { Image } from '@nextui-org/react';

export default function CourseCard({
    id,
    title,
    course_code,
    status,
    goal,
    grade,
}: Course) {
    let bgColour = 'bg-primary-800';
    if (goal === undefined || grade === undefined || grade === 0) {
        //mostly so TypeScript doesn't freak out
    } else {
        bgColour = determineGradeBGColour(goal, grade);
    }
    return (
        <div
            className={classNames(
                'rounded-lg p-2 border-solid border-2 border-primary-500/10',
                bgColour
            )}
        >
            <div className="flex justify-between">
                <h4>Goal: {goal}%</h4>
                <h4>Grade: {grade || '--'}%</h4>
            </div>
            <div className="flex justify-center">
                <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={''}
                    // isLoading={true}
                />
            </div>

            <h3 className="text-left">{course_code}</h3>
            <h4 className="text-left">{title}</h4>
            <h4 className="text-left italic">{ReadableStatus(status)}</h4>
            <LinkButton className="mt-3 w-full" href={courseURL(id)}>
                Visit
            </LinkButton>
        </div>
    );
}
