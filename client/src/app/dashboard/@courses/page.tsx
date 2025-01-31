'use client';

import { CardFooter, CardHeader } from '@heroui/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import Card from '@/components/Card/Card';
import CourseCard from '@/components/Card/Course';
import StatusChip from '@/components/Chip/StatusChip';
import { courseUrl } from '@/lib/helpers/routing';
import { useSemesterListQuery } from '@/lib/query/semester';
import { ItemStatus, SavedSemester } from '@/types';

function renderSemester(
    semester: SavedSemester | null,
    index: number,
    router: AppRouterInstance
) {
    const courses = semester?.courses || (Array(3).fill(null) as null[]);
    return (
        <Fragment key={`semesters-${index}-container`}>
            <Card
                className={`row-span-${semester?.courses.length} flex flex-col justify-between`}
                key={`semesters-${index}-root`}
            >
                <CardHeader>
                    <h3 className="text-left">{semester?.name}</h3>
                </CardHeader>
                <CardFooter className="items-end">
                    <StatusChip
                        status={semester?.status ?? ItemStatus.NOT_STARTED}
                    />
                </CardFooter>
            </Card>
            <div
                className={`grid grid-cols-subgrid gap-2 row-span-${semester?.courses.length}`}
                key={`semesters-${index}-container`}
            >
                {courses.map((course, courseIndex) => {
                    return (
                        <CourseCard
                            key={`semesters-${index}-${courseIndex}`}
                            course={course}
                            isPressable
                            onPress={() => {
                                if (!course) {
                                    return;
                                }
                                console.log(course);
                                router.push(courseUrl(course));
                            }}
                            className="h-full w-full"
                            isLoading={false}
                        />
                    );
                })}
            </div>
        </Fragment>
    );
}

export default function Page() {
    const router = useRouter();
    const { semesters, loadingSemesters } = useSemesterListQuery();
    const semestersToRender = useMemo(() => {
        if (loadingSemesters) {
            return Array(3).fill(null) as null[];
        }
        return semesters || [];
    }, [semesters, loadingSemesters]);
    return (
        <div className="grid grid-cols-[1fr_2fr] gap-4">
            {semestersToRender.map((semester, index) => {
                return renderSemester(semester, index, router);
            })}
        </div>
    );
}
