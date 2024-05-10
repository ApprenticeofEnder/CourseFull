'use client';

import { type SemesterProgressType } from '@/lib/types';
import { classNames } from '@/lib/helpers';
import { Fragment } from 'react';

export default function SemesterProgress({
    semester,
    semesterId,
    average,
    numCourses,
    goal,
}: SemesterProgressType) {
    let gradeColour;
    if (average === null) {
        gradeColour = '';
    } else if (average > goal) {
        gradeColour = 'text-green-400';
    } else if (average == goal) {
        gradeColour = 'text-yellow-400';
    } else {
        gradeColour = 'text-red-400';
    }
    return (
        <div>
            <h2>{semester}</h2>
            <div className="grid grid-cols-2 grid-rows-3">
                <div className={'text-right'}>Current Average:</div>
                <div className={classNames('text-center', gradeColour)}>
                    {average || 'N/A'}
                </div>
                <div className="text-right">Goal:</div>
                <div className="text-center">{goal}</div>
                <div className="text-right">Courses:</div>
                <div className="text-center">{numCourses || 0}</div>
            </div>
        </div>
    );
}
