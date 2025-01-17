import { CardFooter, CardHeader, Skeleton, cn } from '@nextui-org/react';
import { useMemo } from 'react';

import Card from '@/components/Card/Card';
import { renderMarkVsGoal } from '@/lib/helpers';
import { useGradeColours } from '@/lib/hooks/ui';
import { ItemStatus, SavedSemester, ViewableProps } from '@/types';

import StatusChip from '../Chip/StatusChip';

interface SemesterCardProps extends ViewableProps {
    semester: SavedSemester | null;
    isLoading: boolean;
}

export default function SemesterCard({
    semester,
    isLoading,
    handleView,
}: SemesterCardProps) {
    const average = useMemo(() => {
        if (!semester) {
            return undefined;
        }

        const { graded_courses } = semester;
        if (!graded_courses || graded_courses.length === 0) {
            return undefined;
        }

        const gradeSum = graded_courses.reduce((sum, course) => {
            return sum + course.grade;
        }, 0);
        return gradeSum / graded_courses.length;
    }, [semester]);

    const { bgColour, textColour } = useGradeColours(semester?.goal, average);

    return (
        <Skeleton
            isLoaded={!isLoading && !!semester}
            classNames={{ content: 'h-full' }}
        >
            <Card
                className={cn('w-full', bgColour, textColour)}
                isPressable
                onPress={handleView}
            >
                <CardHeader className="flex justify-between">
                    <h3 className="text-lg font-bold">{semester?.name}</h3>
                    <h3 className="text-lg font-bold">
                        {renderMarkVsGoal(average, semester?.goal)}
                    </h3>
                </CardHeader>
                <CardFooter className="flex justify-between items-end">
                    <h4 className="text-left">
                        <b>Courses:</b> {semester?.courses.length}
                    </h4>
                    <StatusChip
                        status={semester?.status || ItemStatus.NOT_STARTED}
                    />
                </CardFooter>
            </Card>
        </Skeleton>
    );
}
