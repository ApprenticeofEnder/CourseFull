import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Divider, useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Button from '@/components/Button/Button';
import StatusChip from '@/components/Chip/StatusChip';
import { renderSemesterAverage } from '@/lib/helpers';
import { useSemesterDeleteMutation } from '@/lib/query/semester';
import { Endpoints, ItemStatus, SavedSemester } from '@/types';

import SemesterProgressCard from '../Card/SemesterProgress';
import NewCourseModal from '../Modal/NewCourse';

interface SemesterDetailProps {
    semester: SavedSemester | undefined;
}

export default function SemesterDetail({ semester }: SemesterDetailProps) {
    const router = useRouter();
    const { semesterDeleteMutate, semesterDeletePending } =
        useSemesterDeleteMutation();

    const semesterAverage = useMemo(() => {
        return renderSemesterAverage(semester);
    }, [semester]);

    const newCourseModal = useDisclosure();

    return (
        <>
            <div className="flex items-start justify-between gap-4">
                <h2 className="flex flex-col justify-start gap-2 text-left">
                    <span>{semester?.name}</span>
                    <StatusChip
                        status={semester?.status || ItemStatus.ACTIVE}
                    />
                </h2>
                <h2 className="min-w-fit text-right">{semesterAverage}</h2>
            </div>
            <SemesterProgressCard
                className="lg:basis-1/2"
                semester={semester}
            />
            <div className="flex flex-col gap-4">
                <Button
                    className="flex-shrink-0"
                    endContent={<PlusIcon className="icon" />}
                    onPress={newCourseModal.onOpen}
                    buttonType="confirm"
                >
                    Add Course
                </Button>
                <Divider></Divider>
                <Button
                    endContent={<PencilIcon className="icon" />}
                    onPress={() => {}}
                >
                    Edit
                </Button>
                <Button
                    endContent={<TrashIcon className="icon" />}
                    onPress={() => {
                        if (
                            !confirm(
                                `Are you sure you want to delete ${semester?.name}? You'll lose all courses and deliverables. You also won't be able to get refunds for any course credits spent.`
                            )
                        ) {
                            return;
                        }
                        semesterDeleteMutate(semester, {
                            onSuccess() {
                                router.push(Endpoints.Page.DASHBOARD);
                            },
                        });
                    }}
                    buttonType="danger"
                    isLoading={semesterDeletePending}
                >
                    Delete
                </Button>
            </div>
            <NewCourseModal
                api_v1_semester_id={semester?.id || ''}
                isOpen={newCourseModal.isOpen}
                onClose={newCourseModal.onClose}
                onOpenChange={newCourseModal.onOpenChange}
            />
        </>
    );
}
