import { CardFooter, CardHeader, Skeleton, cn } from '@heroui/react';
import { useDateFormatter } from '@react-aria/i18n';
import { forwardRef } from 'react';

import Card, { CardProps } from '@/components/Card/Card';
import StatusChip from '@/components/Chip/StatusChip';
import {
    renderDeliverableDeadline,
    renderDeliverableMark,
} from '@/lib/helpers/render';
import { useGradeColours, useTimeRemaining } from '@/lib/hooks/ui';
import { useCourseQuery } from '@/lib/query/course';
import { useSession } from '@/lib/supabase/SessionContext';
import { SavedDeliverable } from '@/types';

interface DeliverableCardProps extends CardProps {
    deliverable: SavedDeliverable | null;
    isLoading: boolean;
    showCourse?: boolean;
    showDeadlineMessage?: boolean;
}

const DeliverableCard = forwardRef<HTMLDivElement, DeliverableCardProps>(
    (
        {
            deliverable,
            className,
            isLoading,
            showCourse = false,
            showDeadlineMessage = false,
            ...props
        },
        ref
    ) => {
        const { session } = useSession();
        const { bgColour, textColour } = useGradeColours(
            deliverable?.goal,
            deliverable?.mark,
            deliverable?.status
        );

        const { course, loadingCourse } = useCourseQuery(
            session,
            deliverable?.api_v1_course_id,
            showCourse
        );

        const { status, deadlineMessage } = useTimeRemaining(deliverable);
        const formatter = useDateFormatter({ dateStyle: 'medium' });
        return (
            <Skeleton isLoaded={!isLoading && !!deliverable && !loadingCourse}>
                <Card
                    ref={ref}
                    {...props}
                    className={cn('w-full', bgColour, textColour)}
                >
                    <CardHeader className="flex flex-wrap justify-between">
                        <h3 className="text-lg font-bold">
                            {showCourse && course && `${course.course_code} - `}
                            {deliverable?.name}
                        </h3>
                        <h3 className="text-lg font-bold">
                            {renderDeliverableMark(deliverable)}
                        </h3>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                        <h4 className="text-left">
                            <div>
                                {renderDeliverableDeadline(
                                    deliverable,
                                    formatter
                                )}
                            </div>
                            <div>{deadlineMessage}</div>
                        </h4>
                        <StatusChip status={status} />
                    </CardFooter>
                </Card>
            </Skeleton>
        );
    }
);

export default DeliverableCard;
