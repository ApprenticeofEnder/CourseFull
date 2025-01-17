import { CardFooter, CardHeader } from '@nextui-org/react';
import { useMemo } from 'react';

import { SavedCourse, SavedSemester } from '@/types';

import Card from '../Card/Card';
import CourseCard from '../Card/Course';
import StatusChip from '../Chip/StatusChip';

interface CoursesProps {
    semesters: SavedSemester[] | undefined;
    loadingSemesters: boolean;
}

export default function Courses({ semesters, loadingSemesters }: CoursesProps) {
    const semestersToRender = useMemo(() => {
        if (loadingSemesters) {
            return Array(3).fill(null) as null[];
        }
        return semesters || [];
    }, [semesters, loadingSemesters]);

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-4">
            {semestersToRender.map((semester, index) => {
                if (!semester) {
                    return (
                        <>
                            <div
                                className={`row-span-3`}
                                key={`semesters-${index}-root`}
                            >
                                a
                            </div>
                            <div
                                className="grid grid-cols-subgrid row-span-3"
                                key={`semesters-${index}-container`}
                            >
                                {[0, 1, 2].map((num, courseIndex) => (
                                    <div
                                        key={`semesters-${index}-${courseIndex}`}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </>
                    );
                }
                return (
                    <>
                        <Card
                            className={`row-span-${semester.courses.length} flex flex-col justify-between`}
                            key={`semesters-${index}-root`}
                        >
                            <CardHeader>
                                <h3 className="text-left">{semester.name}</h3>
                            </CardHeader>
                            <CardFooter className="items-end">
                                <StatusChip status={semester.status} />
                            </CardFooter>
                        </Card>
                        <div
                            className={`grid grid-cols-subgrid gap-2 row-span-${semester.courses.length}`}
                            key={`semesters-${index}-container`}
                        >
                            {semester.courses.map((course, courseIndex) => {
                                return (
                                    <CourseCard
                                        key={`semesters-${index}-${courseIndex}`}
                                        course={course as SavedCourse}
                                        handleView={() => {}}
                                        isPressable
                                        className="w-full h-full"
                                        isLoading={false}
                                    />
                                );
                            })}
                        </div>
                    </>
                );
            })}
        </div>
    );
}
