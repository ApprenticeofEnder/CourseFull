import { Fragment, useCallback, useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
    Modal,
    Spinner,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Listbox,
    ListboxItem,
} from '@nextui-org/react';

import {
    semesterURL,
    classNames,
    determineGradeBGColour,
    ReadableStatus,
} from '@/lib/helpers';
import { SemesterProgressType, SessionProps } from '@/lib/types';
import Button from '@/components/Button/Button';
import CreateSemesterModal from '@/components/Modal/CreateSemester';
import LinkButton from '@/components/Button/LinkButton';
import { getProgress } from '@/services/userService';
import { ItemStatus } from '@/lib/enums';
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
                    console.info('Active semester set.');
                    setLoadingProgress(false);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <Fragment>
            {loadingProgress ? (
                <Spinner label="Loading Progress..." />
            ) : (
                <div className="flex my-5 sm:mx-auto sm:w-3/4 gap-4 lg:h-1/3 flex-col lg:flex-row mb-10">
                    <div className="basis-1/2 border-2 border-primary-500 rounded-lg p-4 flex flex-col justify-between">
                        <h3 className="text-left">Active Semester</h3>

                        <h1>{activeSemester?.semester}</h1>

                        <div className="flex justify-between">
                            <div>
                                <strong>Average vs. Goal</strong>
                                <h2>
                                    {activeSemester?.average || '--'} /{' '}
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
                    <div className="border-2 border-primary-500 rounded-lg basis-1/2 p-4 overflow-auto">
                        <h3 className="text-left">Semesters</h3>
                        <Listbox
                            items={progress}
                            aria-label="Semesters"
                            className="my-4"
                            itemClasses={{
                                base: 'bg-primary-700 p-2 data-[hover=true]:bg-primary-800',
                            }}
                            onAction={(semester_id) => {
                                const href = semesterURL(
                                    semester_id.toString()
                                );
                                router.push(href);
                            }}
                        >
                            {(item) => (
                                <ListboxItem
                                    key={item.semester_id}
                                    startContent={
                                        <LinkButton
                                            href={semesterURL(item.semester_id)}
                                            className="basis-1/3 top-1"
                                        >
                                            {item.semester}
                                        </LinkButton>
                                    }
                                    endContent={
                                        <span className="basis-1/3">
                                            {ReadableStatus(item.status)}
                                        </span>
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
                                >
                                    <div className="w-full text-center">
                                        {item.average || '--'} / {item.goal} %
                                    </div>
                                </ListboxItem>
                            )}
                        </Listbox>
                        <Button
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            className="w-full my-2 mx-auto focus:bg-warning-100"
                            onPressEnd={onOpen}
                            buttonType="confirm"
                        >
                            Create New Semester
                        </Button>
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
