import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Divider, useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Button from '@/components/Button/Button';
import CourseProgressCard from '@/components/Card/CourseProgress';
import StatusChip from '@/components/Chip/StatusChip';
import EditCourseModal from '@/components/Modal/EditCourse';
import NewDeliverableModal from '@/components/Modal/NewDeliverable';
import { renderCourseGrade } from '@/lib/helpers';
import { semesterUrlFromCourse } from '@/lib/helpers/routing';
import { useCourseDeleteMutation } from '@/lib/query/course';
import { useSession } from '@/lib/supabase/SessionContext';
import { ItemStatus, SavedCourse } from '@/types';

interface CourseDetailProps {
    course: SavedCourse | undefined;
}

export default function CourseDetail({ course }: CourseDetailProps) {
    const router = useRouter();
    const { session } = useSession();
    const { courseDeleteMutate, courseDeletePending } = useCourseDeleteMutation(
        session,
        course
    );

    const courseGrade = useMemo(() => {
        return renderCourseGrade(course);
    }, [course]);

    const newDeliverableModal = useDisclosure();
    const editCourseModal = useDisclosure();
    return (
        <>
            <div className="flex items-start justify-between gap-4">
                <h2 className="flex flex-col justify-start gap-2 text-left">
                    <span>{course?.course_code}</span>
                    <StatusChip status={course?.status || ItemStatus.ACTIVE} />
                </h2>
                <h2 className="min-w-fit text-right">{courseGrade}</h2>
            </div>
            <CourseProgressCard className="lg:basis-1/2" course={course} />
            <div className="flex flex-col gap-4">
                <Button
                    className="flex-shrink-0"
                    endContent={<PlusIcon className="icon" />}
                    onPress={newDeliverableModal.onOpen}
                    buttonType="confirm"
                >
                    Add Deliverable
                </Button>
                <Divider></Divider>
                <Button
                    endContent={<PencilIcon className="icon" />}
                    onPress={editCourseModal.onOpen}
                >
                    Edit
                </Button>
                <Button
                    endContent={<TrashIcon className="icon" />}
                    onPress={() => {
                        if (
                            !confirm(
                                `Are you sure you want to delete ${course?.course_code}? You'll lose all deliverables and you won't be able to get a refund for the course credit.`
                            )
                        ) {
                            return;
                        }
                        courseDeleteMutate(undefined, {
                            onSuccess() {
                                router.push(semesterUrlFromCourse(course!));
                            },
                        });
                    }}
                    buttonType="danger"
                    isLoading={courseDeletePending}
                >
                    Delete
                </Button>
            </div>
            <NewDeliverableModal
                api_v1_course_id={course?.id || ''}
                isOpen={newDeliverableModal.isOpen}
                onClose={newDeliverableModal.onClose}
                onOpenChange={newDeliverableModal.onOpenChange}
            />
            {course && (
                <EditCourseModal
                    course={course}
                    isOpen={editCourseModal.isOpen}
                    onOpenChange={editCourseModal.onOpenChange}
                    onClose={editCourseModal.onClose}
                />
            )}
        </>
    );
}
