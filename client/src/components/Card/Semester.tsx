import { CardFooter, CardHeader, CardProps, Skeleton, cn } from '@heroui/react';
import { forwardRef, useMemo } from 'react';

import Card from '@/components/Card/Card';
import StatusChip from '@/components/Chip/StatusChip';
import { useSemesterAverage } from '@/lib/hooks/ui';
import { ItemStatus, SavedSemester } from '@/types';

interface SemesterCardProps extends CardProps {
    semester: SavedSemester | null;
    isLoading: boolean;
}

const SemesterCard = forwardRef<HTMLDivElement, SemesterCardProps>(
    ({ semester, className, isLoading, ...props }, ref) => {
        const {
            colours: { bgColour, textColour },
            renderedAverage,
        } = useSemesterAverage(semester);
        return (
            <Skeleton
                isLoaded={!isLoading && !!semester}
                classNames={{ content: 'h-full' }}
            >
                <Card
                    ref={ref}
                    className={cn(
                        className,
                        bgColour,
                        textColour,
                        'flex w-full flex-col justify-between'
                    )}
                    {...props}
                >
                    <CardHeader className="flex justify-between">
                        <h3 className="text-lg font-bold">{semester?.name}</h3>
                        <h3 className="text-lg font-bold">{renderedAverage}</h3>
                    </CardHeader>
                    <CardFooter className="flex items-end justify-between">
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
);

SemesterCard.displayName = 'SemesterCard';

export default SemesterCard;
