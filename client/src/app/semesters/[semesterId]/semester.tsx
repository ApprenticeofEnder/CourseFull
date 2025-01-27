'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { BreadcrumbItem, Breadcrumbs, Divider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import Button from '@/components/Button/Button';
import CourseCard from '@/components/Card/Course';
import Link from '@/components/Ui/Link';
import { courseUrl } from '@/lib/helpers/routing';
import { useSkeletonItems } from '@/lib/hooks/data';
import { useSemesterQuery } from '@/lib/query/semester';
import { useSession } from '@/lib/supabase/SessionContext';
import { Endpoints } from '@/types';

const SemesterPage: FC<{ semesterId: string }> = ({ semesterId }) => {
    const { session } = useSession();
    const router = useRouter();
    const { semester, loadingSemester } = useSemesterQuery(session, semesterId);

    const coursesToRender = useSkeletonItems(
        semester?.courses,
        loadingSemester
    );

    return (
        <>
            <div className="flex flex-wrap gap-4 justify-between items-end">
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
                </Breadcrumbs>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="text-left font-bold flex flex-wrap">
                    <span>{semester?.name}</span>
                </h2>
            </div>
            <Divider></Divider>
            <div className="flex flex-col md:flex-row gap-4 my-4 md:h-screen">
                <div className="w-full md:basis-1/2 lg:basis-1/3 order-2 md:order-1 flex flex-col gap-4">
                    <Button
                        className="top-2 order-last md:order-first flex-shrink-0"
                        endContent={<PlusIcon className="icon" />}
                        onPress={() => {}}
                        buttonType="confirm"
                    >
                        Add Course
                    </Button>
                    <Divider className="collapse md:visible mt-2"></Divider>
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
                </div>
                <div className="w-full md:h-full md:basis-1/2 lg:basis-2/3 order-1 md:flex-1 md:order-2 flex flex-col gap-4">
                    Test
                </div>
            </div>
        </>
    );
};

export default SemesterPage;
