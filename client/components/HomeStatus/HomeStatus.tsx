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
} from '@nextui-org/react';

import { determineGradeColour, semesterURL, classNames } from '@/lib/helpers';
import { SemesterProgressType, SessionProps } from '@/lib/types';
import ConfirmButton from '@/components/Button/ConfirmButton';
import CreateSemesterModal from '@/components/Modal/CreateSemester';
import LinkButton from '@/components/Button/LinkButton';
import { getProgress } from '@/services/userService';

export default function HomeStatus({ session }: SessionProps) {
    const [progress, setProgress] = useState<SemesterProgressType[]>([]);

    const [loadingProgress, setLoadingProgress] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function onFailure(error: Error) {
        alert('Error: ' + error.message);
    }

    const renderCell = useCallback(
        (progressEntry: SemesterProgressType, columnKey: React.Key) => {
            const cellValue =
                progressEntry[columnKey as keyof SemesterProgressType];
            switch (columnKey) {
                case 'semester':
                    return (
                        <LinkButton
                            href={semesterURL(progressEntry.semester_id)}
                            className="w-full top-1"
                        >
                            {cellValue}
                        </LinkButton>
                    );
                case 'average':
                    return (
                        <p
                            className={classNames(
                                'font-bold px-3 text-center',
                                progressEntry.grade_colour || ''
                            )}
                        >
                            {cellValue || '--'}%
                        </p>
                    );
                case 'num_courses':
                case 'goal':
                    return <p className="px-3 text-center">{cellValue}</p>;
                default:
                    return cellValue;
            }
        },
        []
    );

    useEffect(() => {
        let mounted = true;
        setLoadingProgress(true);

        getProgress(session, onFailure)
            .then(({ response }) => {
                if (mounted) {
                    const data: SemesterProgressType[] = response?.data;
                    setProgress(
                        data.map((progressEntry) => {
                            const { average, num_courses, goal } =
                                progressEntry;
                            if (average === 0 || num_courses === 0) {
                                progressEntry.grade_colour = '';
                            } else {
                                progressEntry.grade_colour =
                                    determineGradeColour(goal, average);
                            }
                            return progressEntry;
                        }) || []
                    );
                    setLoadingProgress(false);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, []);

    const columns = [
        { key: 'semester', label: 'Semester' },
        { key: 'num_courses', label: 'Courses' },
        { key: 'average', label: 'Average' },
        { key: 'goal', label: 'Goal' },
    ];

    return (
        <Fragment>
            {loadingProgress ? (
                <Spinner label="Loading Progress..." />
            ) : (
                <Table
                    aria-label="Semester progress"
                    className="my-5 sm:mx-auto sm:w-3/4"
                    classNames={{
                        table: 'bg-background-900',
                        th: 'bg-background-800',
                        td: 'px-0',
                        wrapper: 'bg-background-900',
                    }}
                    bottomContent={
                        <ConfirmButton
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            className="w-full my-2 mx-auto focus:bg-warning-100"
                            onPressEnd={onOpen}
                        >
                            Create New Semester
                        </ConfirmButton>
                    }
                >
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn
                                className="text-center"
                                key={column.key}
                            >
                                {column.label}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody
                        emptyContent="You don't have any active semesters."
                        items={progress}
                    >
                        {progress.map((progressEntry) => (
                            <TableRow key={progressEntry.semester_id}>
                                {(columnKey) => (
                                    <TableCell
                                        key={`${columnKey}-${progressEntry.semester_id}`}
                                    >
                                        {renderCell(progressEntry, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
