'use client';

import { BreadcrumbItem, Breadcrumbs, Divider, Link } from '@heroui/react';
import { FC } from 'react';

import DeliverableCard from '@/components/Card/Deliverable';
import CourseDetail from '@/components/Detail/Course';
import { courseUrl, semesterUrl } from '@/lib/helpers/routing';
import { useSkeletonItems } from '@/lib/hooks/data';
import { useCourseQuery } from '@/lib/query/course';
import { useSemesterQuery } from '@/lib/query/semester';
import { useSession } from '@/lib/supabase/SessionContext';
import { Endpoints } from '@/types';

const CoursePage: FC<{ courseId: string }> = ({ courseId }) => {
    const { session } = useSession();
    const { course, loadingCourse } = useCourseQuery(session, courseId);
    const { semester, loadingSemester } = useSemesterQuery(
        session,
        course?.api_v1_semester_id,
        !!course
    );

    const deliverablesToRender = useSkeletonItems(
        course?.deliverables,
        loadingCourse
    );

    return (
        <>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <Breadcrumbs
                    size="lg"
                    itemsBeforeCollapse={0}
                    itemsAfterCollapse={1}
                    maxItems={1}
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
                    <BreadcrumbItem>
                        <Link
                            href={semester ? semesterUrl(semester) : '#'}
                            className="text-xl"
                        >
                            {semester?.name}
                        </Link>
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="flex items-center justify-between">
                <h2 className="flex flex-wrap text-left font-bold">
                    <span>{course?.course_code}</span>
                    <span>:&nbsp;</span>
                    <span className="font-normal">{course?.title}</span>
                </h2>
            </div>
            <Divider></Divider>
            <div className="my-4 flex flex-col gap-4 md:h-screen md:flex-row">
                <div className="order-2 flex w-full flex-col gap-4 md:order-1 md:basis-1/2 lg:basis-1/3">
                    {deliverablesToRender.map((deliverable, index) => {
                        return (
                            <DeliverableCard
                                key={`deliverable-${index}`}
                                deliverable={deliverable}
                                isLoading={!deliverable}
                                showCourse={false}
                                onPress={() => {}}
                                isPressable
                            />
                        );
                    })}
                    {deliverablesToRender.length === 0 && (
                        <div className="card-secondary">
                            No deliverables yet. Maybe add one using the big
                            green button?
                        </div>
                    )}
                </div>
                <div className="card-primary order-1 flex w-full flex-col justify-between gap-4 md:order-2 md:h-full md:flex-1 md:basis-1/2 lg:basis-2/3">
                    <CourseDetail course={course} />
                </div>
            </div>
            <Divider></Divider>
        </>
    );
};

export default CoursePage;
