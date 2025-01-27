import { PlusIcon } from '@heroicons/react/24/outline';

import SemesterCard from '@/components/Card/Semester';
import { useSkeletonItems } from '@/lib/hooks/data';
import { SavedSemester } from '@/types';

import LinkButton from '../Button/LinkButton';

interface SemestersProps {
    semesters: SavedSemester[] | undefined;
    loadingSemesters: boolean;
}

export default function Semesters({
    semesters,
    loadingSemesters,
}: SemestersProps) {
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
                        handleView={() => {}}
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
