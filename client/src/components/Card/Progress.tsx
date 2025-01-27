import { CardBody, CardFooter, CardHeader, Skeleton, cn } from '@heroui/react';
import { forwardRef } from 'react';

import Card, { CardProps } from '@/components/Card/Card';
import { useCourseProgressCard } from '@/lib/hooks/ui';
import { SavedCourse } from '@/types';

interface ProgressCardProps extends CardProps {
    course: SavedCourse | undefined;
    isLoading?: boolean;
}

const ProgressCard = forwardRef<HTMLDivElement, ProgressCardProps>(
    ({ course, className, isLoading = false, ...props }, ref) => {
        const { bgColour, textColour, message } = useCourseProgressCard(course);

        return (
            <Skeleton
                classNames={{
                    content: 'w-full h-full',
                    base: 'h-full',
                }}
                isLoaded={!isLoading && !!course}
            >
                <Card
                    ref={ref}
                    {...props}
                    className={cn(
                        className,
                        bgColour,
                        textColour,
                        'flex h-full w-full flex-col justify-between'
                    )}
                >
                    <CardBody className="justify-center">
                        <h2 className="font-bold">{message}</h2>
                    </CardBody>
                    <CardFooter>
                        <p className="w-full text-center">
                            You need{' '}
                            <span className="font-bold italic">
                                {course?.deliverable_goal}%
                            </span>{' '}
                            on each deliverable to reach your goals!
                        </p>
                    </CardFooter>
                </Card>
            </Skeleton>
        );
    }
);

ProgressCard.displayName = 'ProgressCard';

export default ProgressCard;
