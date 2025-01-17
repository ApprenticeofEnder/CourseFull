import { CardFooter, CardHeader, Skeleton, cn } from '@nextui-org/react';
import { forwardRef } from 'react';

import Card, { CardProps } from '@/components/Card/Card';
import { renderCourseGrade } from '@/lib/helpers';
import { useCourseGradeColours, useGradeColours } from '@/lib/hooks/ui';
import { ItemStatus, SavedCourse, ViewableProps } from '@/types';

import StatusChip from '../Chip/StatusChip';

interface CourseCardProps extends ViewableProps, CardProps {
    course: SavedCourse | null;
    isLoading: boolean;
}

const CourseCard = forwardRef<HTMLDivElement, CourseCardProps>(
    ({ course, className, isLoading, ...props }, ref) => {
        const { bgColour, textColour } = useCourseGradeColours(course);

        return (
            <Skeleton
                classNames={{ content: 'h-full' }}
                isLoaded={!isLoading && !!course}
            >
                <Card
                    ref={ref}
                    {...props}
                    className={cn(
                        className,
                        bgColour,
                        textColour,
                        'flex flex-col justify-between'
                    )}
                >
                    <CardHeader className="flex justify-between">
                        <h3 className="text-lg font-bold">
                            {course?.course_code}
                        </h3>
                        <h3 className="text-lg font-bold">
                            {renderCourseGrade(course)}
                        </h3>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-end">
                        <h4 className="text-left text-lg">{course?.title}</h4>
                        <StatusChip
                            status={course?.status || ItemStatus.ACTIVE}
                        />
                    </CardFooter>
                </Card>
            </Skeleton>
        );
    }
);

CourseCard.displayName = 'CourseCard';

export default CourseCard;
