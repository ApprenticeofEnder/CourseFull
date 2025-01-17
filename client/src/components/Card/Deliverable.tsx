import { CardFooter, CardHeader, Skeleton, cn } from '@nextui-org/react';
import { useDateFormatter } from '@react-aria/i18n';

import Card from '@/components/Card/Card';
import StatusChip from '@/components/Chip/StatusChip';
import {
    renderDeliverableDeadline,
    renderDeliverableMark,
} from '@/lib/helpers/render';
import { useGradeColours, useTimeRemaining } from '@/lib/hooks/ui';
import { useCourseQuery } from '@/lib/query/course';
import { useSession } from '@/lib/supabase/SessionContext';
import { SavedDeliverable, ViewableProps } from '@/types';

interface DeliverableCardProps extends ViewableProps {
    deliverable: SavedDeliverable | null;
    isLoading: boolean;
    showCourse?: boolean;
}

export default function DeliverableCard({
    deliverable,
    isLoading,
    showCourse = false,
    handleView,
}: DeliverableCardProps) {
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
                className={cn('w-full', bgColour, textColour)}
                isPressable
                onPress={handleView}
            >
                <CardHeader className="flex flex-wrap justify-between">
                    <h3 className="text-lg font-bold">
                        {course && `${course.course_code} - `}
                        {deliverable?.name}
                    </h3>
                    <h3 className="text-lg font-bold">
                        {renderDeliverableMark(deliverable)}
                    </h3>
                </CardHeader>
                <CardFooter className="flex justify-between items-end">
                    <h4>
                        <b>Deadline:</b>{' '}
                        {renderDeliverableDeadline(deliverable, formatter)} (
                        {deadlineMessage})
                    </h4>
                    <StatusChip status={status} />
                </CardFooter>
            </Card>
        </Skeleton>
    );
}
