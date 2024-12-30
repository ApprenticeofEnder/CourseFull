import { PlusIcon } from '@heroicons/react/24/outline';
import {
    Chip,
    Listbox,
    ListboxItem,
    Modal,
    Spinner,
    useDisclosure,
} from '@nextui-org/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
    classNames,
    determineGradeBGColour,
    ReadableStatus,
    semesterURL,
} from '@lib/helpers';
import Button from '@components/Button/Button';
import LinkButton from '@components/Button/LinkButton';
import CreateSemesterModal from '@components/Modal/CreateSemester';
import {
    ItemStatus,
    SemesterProgressType,
    SessionProps,
    User,
} from '@coursefull';
import { getProgress, getUserData } from '@services/userService';

function renderAverage(item: SemesterProgressType | null | undefined): string {
    if (!item) {
        return '--';
    }
    let average = item.average.toFixed(1);
    if (item.num_graded_courses <= 0) {
        average = '--';
    }
    return average;
}

function getChipColour(status: ItemStatus) {
    switch (status) {
        case ItemStatus.NOT_STARTED:
            return 'default';
        case ItemStatus.ACTIVE:
            return 'primary';
        case ItemStatus.COMPLETE:
            return 'success';
    }
}

function renderSemester(item: SemesterProgressType) {
    return (
        <ListboxItem
            key={item.semester_id}
            startContent={
                <LinkButton
                    href={semesterURL(item.semester_id)}
                    className="basis-3/4 sm:basis-1/2 top-1"
                >
                    <span data-testid={`semester-btn-${item.semester}`}>
                        {item.semester}
                    </span>
                </LinkButton>
            }
            endContent={
                <div className="sm:text-lg basis-1/4 text-right flex flex-col sm:flex-row sm:gap-1 sm:justify-end">
                    <div className="text-center">{renderAverage(item)} /</div>
                    <div className="text-center">{item.goal}</div>
                </div>
            }
            className={
                (item.status === ItemStatus.ACTIVE ||
                    item.status === ItemStatus.COMPLETE) &&
                item.average
                    ? determineGradeBGColour(item.goal, item.average)
                    : ''
            }
            textValue={`${item.average} % out of ${item.goal} %`}
        >
            <div className="hidden md:flex md:justify-center">
                <Chip
                    classNames={{
                        content: 'font-bold',
                    }}
                    color={getChipColour(item.status)}
                    variant="solid"
                >
                    {ReadableStatus(item.status)}
                </Chip>
            </div>
        </ListboxItem>
    );
}

export default function Dashboard({ session }: SessionProps) {
    const progressResult = useQuery({
        queryKey: ['progress'],
        queryFn: async () => {
            return getProgress(session);
        },
    });

    const progress: SemesterProgressType[] | undefined = progressResult.data;
    const loadingProgress: boolean = progressResult.isLoading;
    const progressError: Error | null = progressResult.error;
    if (progressError) {
        throw progressError;
    }

    const activeSemester = useMemo(
        () =>
            progress
                ?.filter((semester) => semester.status === ItemStatus.ACTIVE)
                .shift() || null,
        [progress]
    );

    const userResult = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            return getUserData(session);
        },
    });
    const userData: User | undefined = userResult.data;
    const loadingUserData: boolean = userResult.isLoading;
    const userError: Error | null = userResult.error;
    if (userError) {
        throw progressError;
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const router = useRouter();

    return (
        <div className="h-full">
            <h1>Hey, {session.user.user_metadata.first_name}!</h1>
            {loadingProgress ? (
                <Spinner label="Loading Progress..." />
            ) : (
                <div className="flex my-5 sm:mx-auto w-full gap-8 lg:h-1/2 lg:max-h-64 flex-col sm:flex-row mb-10">
                    <div
                        className={classNames(
                            'basis-1/2 border-2 border-primary-600/15 rounded-lg p-4 flex flex-col justify-between gap-4',
                            activeSemester?.average
                                ? determineGradeBGColour(
                                      activeSemester?.goal,
                                      activeSemester.average
                                  )
                                : 'bg-primary-800'
                        )}
                    >
                        <h3 className="text-left">Active Semester</h3>

                        <h2 className="font-bold">
                            {activeSemester?.semester || 'No Active Semester'}
                        </h2>

                        <div className="flex justify-between">
                            <div>
                                <strong>Average vs. Goal</strong>
                                <h2>
                                    {renderAverage(activeSemester)} /{' '}
                                    {activeSemester?.goal} %
                                </h2>
                            </div>
                            <div className="text-right">
                                <strong>Courses</strong>
                                <h2 className="text-right">
                                    {activeSemester?.num_courses}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className=" rounded-lg basis-2/3 py-4 overflow-visible">
                        <div className="flex justify-between">
                            <h3 className="text-left">Semesters</h3>
                            <Button
                                endContent={
                                    <PlusIcon className="h-6 w-6"></PlusIcon>
                                }
                                className="top-1 focus:bg-warning-100"
                                onPressEnd={onOpen}
                                buttonType="confirm"
                                data-testid="create-semester-button"
                            >
                                Create New
                            </Button>
                        </div>

                        <Listbox
                            items={progress}
                            aria-label="Semesters"
                            className="my-4"
                            itemClasses={{
                                base: 'bg-primary-700 py-2 data-[hover=true]:bg-primary-800',
                            }}
                            onAction={(semester_id) => {
                                const href = semesterURL(
                                    semester_id.toString()
                                );
                                router.push(href);
                            }}
                            emptyContent={
                                <div className="text-center">
                                    You don&apos;t have any semesters. Start by
                                    adding some!
                                </div>
                            }
                        >
                            {(item) => renderSemester(item)}
                        </Listbox>
                    </div>
                </div>
            )}

            {userData && (
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    className="bg-sky-100"
                    scrollBehavior="inside"
                    classNames={{ footer: 'justify-between' }}
                >
                    <CreateSemesterModal
                        session={session}
                        userData={userData || null}
                        loadingUserData={loadingUserData}
                    />
                </Modal>
            )}
        </div>
    );
}
