'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

import LinkButton from '@/components/Button/LinkButton';
import SemesterCard from '@/components/Card/Semester';
import { semesterUrl } from '@/lib/helpers/routing';
import { useSkeletonItems } from '@/lib/hooks/data';
import { useSemesterListQuery } from '@/lib/query/semester';
import { SavedSemester } from '@/types';

export default function SemestersPage() {
    const router = useRouter();
    const { semesters, loadingSemesters } = useSemesterListQuery();

    const semestersToRender = useSkeletonItems<SavedSemester>(
        semesters,
        loadingSemesters
    );
    return (
        <>
            {semestersToRender.map((semester, index) => {
                return (
                    <SemesterCard
                        key={`semester-${index}`}
                        semester={semester}
                        isLoading={loadingSemesters}
                        isPressable
                        onPress={() => {
                            if (!semester) {
                                return;
                            }
                            router.push(semesterUrl(semester));
                        }}
                    />
                );
            })}
            <LinkButton
                href="/semesters/new"
                buttonType="confirm"
                endContent={<PlusIcon className="icon"></PlusIcon>}
            >
                Add New Semester
            </LinkButton>
        </>
    );
}
