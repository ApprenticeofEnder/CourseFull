import { PlusIcon } from '@heroicons/react/24/outline';
import {
    Chip,
    Listbox,
    ListboxItem,
    Modal,
    Spinner,
    useDisclosure,
} from '@nextui-org/react';
import { Fragment, useEffect, useState } from 'react';

import {
    classNames,
    determineGradeBGColour,
    ReadableStatus,
    semesterURL,
} from '@lib/helpers';
// import { SemesterProgressType, SessionProps } from '@coursefull';
import Button from '@components/Button/Button';
import LinkButton from '@components/Button/LinkButton';
import CreateSemesterModal from '@components/Modal/CreateSemester';
import { ItemStatus, SemesterProgressType, SessionProps } from '@coursefull';
import { getProgress } from '@services/userService';
import { useRouter } from 'next/navigation';

export default function HomeStatus({ session }: SessionProps) {
    const [progress, setProgress] = useState<SemesterProgressType[]>([]);

    const [activeSemester, setActiveSemester] =
        useState<SemesterProgressType | null>();

    const [loadingProgress, setLoadingProgress] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function onFailure(error: Error) {
        alert('Error: ' + error.message);
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

    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        setLoadingProgress(true);

        getProgress(session, onFailure)
            .then(({ response }) => {
                if (mounted) {
                    const data: SemesterProgressType[] = response?.data;
                    setProgress(data);
                    setActiveSemester(
                        data
                            .filter(
                                (semester) =>
                                    semester.status === ItemStatus.ACTIVE
                            )
                            .shift()
                    );
                    setLoadingProgress(false);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, [session]);

    return (
        <Fragment>
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
                                    {activeSemester?.average.toFixed(1) || '--'}{' '}
                                    / {activeSemester?.goal} %
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
                            {(item) => (
                                <ListboxItem
                                    key={item.semester_id}
                                    startContent={
                                        <LinkButton
                                            href={semesterURL(item.semester_id)}
                                            className="basis-3/4 sm:basis-1/2 top-1"
                                        >
                                            <span
                                                data-testid={`semester-btn-${item.semester}`}
                                            >
                                                {item.semester}
                                            </span>
                                        </LinkButton>
                                    }
                                    endContent={
                                        <div className="sm:text-lg basis-1/4 text-right flex flex-col sm:flex-row sm:gap-1 sm:justify-end">
                                            <div className="text-center">
                                                {item.average?.toFixed(1) ||
                                                    '--'}{' '}
                                                /
                                            </div>
                                            <div className="text-center">
                                                {item.goal}
                                            </div>
                                        </div>
                                    }
                                    className={
                                        (item.status === ItemStatus.ACTIVE ||
                                            item.status ===
                                                ItemStatus.COMPLETE) &&
                                        item.average
                                            ? determineGradeBGColour(
                                                  item.goal,
                                                  item.average
                                              )
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
                            )}
                        </Listbox>
                    </div>
                </div>
                // <Table
                //     aria-label="Semester progress"
                //     className="my-5 sm:mx-auto sm:w-3/4"
                //     classNames={{
                //         table: 'bg-background-900',
                //         th: 'bg-background-800',
                //         td: 'px-0',
                //         wrapper: 'bg-background-900',
                //     }}
                //     bottomContent={
                //         <Button
                //             endContent={
                //                 <PlusIcon className="h-6 w-6"></PlusIcon>
                //             }
                //             className="w-full my-2 mx-auto focus:bg-warning-100"
                //             onPressEnd={onOpen}
                //             buttonType="confirm"
                //         >
                //             Create New Semester
                //         </Button>
                //     }
                // >
                //     <TableHeader>
                //         {columns.map((column) => (
                //             <TableColumn
                //                 className="text-center"
                //                 key={column.key}
                //             >
                //                 {column.label}
                //             </TableColumn>
                //         ))}
                //     </TableHeader>
                //     <TableBody
                //         emptyContent="You don't have any active semesters."
                //         items={progress}
                //     >
                //         {progress.map((progressEntry) => (
                //             <TableRow key={progressEntry.semester_id}>
                //                 {(columnKey) => (
                //                     <TableCell
                //                         key={`${columnKey}-${progressEntry.semester_id}`}
                //                     >
                //                         {renderCell(progressEntry, columnKey)}
                //                     </TableCell>
                //                 )}
                //             </TableRow>
                //         ))}
                //     </TableBody>
                // </Table>
            )}

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="bg-sky-100"
            >
                <CreateSemesterModal session={session} />
            </Modal>
        </Fragment>
    );
}
