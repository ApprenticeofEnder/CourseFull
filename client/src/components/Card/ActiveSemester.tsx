'use client';

import { CardBody, CardFooter, CardHeader, cn } from "@heroui/react";

import Card from '@/components/Card/Card';
import { renderSemesterProgressAverage } from '@/lib/helpers/render';
import { useGradeColours } from '@/lib/hooks/ui';
import { SemesterProgressType } from '@/types';

interface ActiveSemesterCardProps {
    activeSemester: SemesterProgressType | null;
}

export default function ActiveSemesterCard({
    activeSemester,
}: ActiveSemesterCardProps) {
    const { bgColour, textColour } = useGradeColours(
        activeSemester?.goal,
        activeSemester?.average
    );
    return (
        <Card className={cn('h-full', bgColour, textColour)}>
            <CardHeader>
                <h3 className="text-left">Active Semester</h3>
            </CardHeader>
            <CardBody>
                <h2 className="font-bold">
                    {activeSemester?.semester || 'No Active Semester'}
                </h2>
            </CardBody>
            <CardFooter className="flex justify-between">
                <div>
                    <strong>Average vs. Goal</strong>
                    <h2>{renderSemesterProgressAverage(activeSemester)}</h2>
                </div>
                <div className="text-right">
                    <strong>Courses</strong>
                    <h2 className="text-right">
                        {activeSemester?.num_courses}
                    </h2>
                </div>
            </CardFooter>
        </Card>
    );
}
