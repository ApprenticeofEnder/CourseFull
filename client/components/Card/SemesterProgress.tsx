'use client';

import { type SemesterProgressType } from '@/lib/types';
import { classNames } from '@/lib/helpers';
import { Fragment } from 'react';

export default function SemesterProgress({
    semester,
    average,
    num_courses,
    goal,
}: SemesterProgressType) {
    let gradeColour;
    if (average === 0 || num_courses === 0) {
        gradeColour = '';
    } else if (average > goal) {
        gradeColour = 'text-success-500';
    } else if (average == goal) {
        gradeColour = 'text-warning-500';
    } else {
        gradeColour = 'text-danger-400';
    }
    return (
        <div>
            <h2>{semester}</h2>
            <div className="grid grid-cols-2 grid-rows-3 text-lg">
                <div className="text-right">Current Average:</div>
                <div
                    className={classNames('text-center font-bold', gradeColour)}
                >
                    {average || 'N/A'}
                </div>
                <div className="text-right">Goal:</div>
                <div className="text-center font-bold">{goal}</div>
                <div className="text-right">Courses:</div>
                <div className="text-center font-bold">{num_courses || 0}</div>
            </div>
        </div>
    );
}
