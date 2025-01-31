'use client';

import { BreadcrumbItem, Breadcrumbs, Divider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';

import CourseCard from '@/components/Card/Course';
import SemesterDetail from '@/components/Detail/Semester';
import Link from '@/components/Ui/Link';
import { courseUrl } from '@/lib/helpers/routing';
import { useSkeletonItems } from '@/lib/hooks/data';
import { useWindowDimensions } from '@/lib/hooks/ui';
import { useSemesterQuery } from '@/lib/query/semester';
import { Endpoints } from '@/types';

const SemesterPage: FC<{ semesterId: string }> = ({ semesterId }) => {
    const router = useRouter();
    const { semester, loadingSemester } = useSemesterQuery(semesterId);

    const coursesToRender = useSkeletonItems(
        semester?.courses,
        loadingSemester
    );

    const { width } = useWindowDimensions();

    const maxBreadcrumbItems = useMemo(() => {
        if (!width || width < 640) {
            return 1;
        }
        return 3;
    }, [width]);

    return (
        <>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <Breadcrumbs
                    size="lg"
                    itemsBeforeCollapse={0}
                    itemsAfterCollapse={1}
                    maxItems={maxBreadcrumbItems}
                >
                    <BreadcrumbItem>
                        <Link
                            href={Endpoints.Page.DASHBOARD}
                            className="text-xl"
                        >
                            Dashboard
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link
                            href={Endpoints.Page.SEMESTERS}
                            className="text-xl"
                        >
                            Semesters
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="flex items-center justify-between">
                <h2 className="flex flex-wrap text-left font-bold">
                    <span>{semester?.name}</span>
                </h2>
            </div>
            <Divider></Divider>
            <div className="my-4 flex flex-col gap-4 md:h-screen md:flex-row">
                <div className="order-2 flex w-full flex-col gap-4 md:order-1 md:basis-1/2 lg:basis-1/3">
                    {coursesToRender.map((course, index) => {
                        return (
                            <CourseCard
                                key={`course-${index}`}
                                course={course}
                                isLoading={!course}
                                isPressable
                                onPress={() => {
                                    if (!course) {
                                        return;
                                    }
                                    router.push(courseUrl(course));
                                }}
                            />
                        );
                    })}
                    {coursesToRender.length === 0 && (
                        <div className="card-secondary">
                            No courses yet. Maybe add one using the big green
                            button?
                        </div>
                    )}
                </div>
                <div className="card-primary order-1 flex w-full flex-col gap-4 p-4 md:order-2 md:h-fit md:flex-1 md:basis-1/2 lg:basis-2/3">
                    <SemesterDetail semester={semester} />
                </div>
            </div>
            <Divider></Divider>
        </>
    );
};

export default SemesterPage;
