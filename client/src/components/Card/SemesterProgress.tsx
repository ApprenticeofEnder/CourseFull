import { CardBody, Skeleton, cn } from '@heroui/react';
import { forwardRef } from 'react';

import Card, { CardProps } from '@/components/Card/Card';
import { useSemesterProgressCard } from '@/lib/hooks/ui';
import { SavedSemester } from '@/types';

interface SemesterProgressCardProps extends CardProps {
    semester: SavedSemester | undefined;
    isLoading?: boolean;
}

const SemesterProgressCard = forwardRef<
    HTMLDivElement,
    SemesterProgressCardProps
>(({ semester, className, isLoading = false, ...props }, ref) => {
    const { bgColour, textColour, message } = useSemesterProgressCard(semester);

    return (
        <Skeleton
            classNames={{
                content: 'w-full h-full',
                base: 'h-full',
            }}
            isLoaded={!isLoading && !!semester}
        >
            <Card
                ref={ref}
                {...props}
                className={cn(
                    className,
                    bgColour,
                    textColour,
                    'flex h-fit w-full flex-col justify-between'
                )}
            >
                <CardBody className="justify-center">
                    <h2 className="font-bold">{message}</h2>
                </CardBody>
            </Card>
        </Skeleton>
    );
});

SemesterProgressCard.displayName = 'SemesterProgressCard';

export default SemesterProgressCard;
