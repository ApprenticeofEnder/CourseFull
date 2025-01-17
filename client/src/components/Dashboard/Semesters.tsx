import SemesterCard from '@/components/Card/Semester';
import { useSkeletonItems } from '@/lib/hooks/data';
import { SavedSemester } from '@/types';

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

    return semestersToRender.map((semester, index) => {
        return (
            <SemesterCard
                key={`semester-${index}`}
                semester={semester}
                isLoading={loadingSemesters}
                handleView={() => {}}
            />
        );
    });
}
