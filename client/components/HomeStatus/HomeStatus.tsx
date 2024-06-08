import { Fragment, useCallback, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
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
    getKeyValue,
} from '@nextui-org/react';

import { determineGradeColour, semesterURL, classNames } from '@/lib/helpers';
import { Semester, SemesterProgressType, SessionProps } from '@/lib/types';
import Progress from '@/components/Card/SemesterProgress';
import DisclosureButton from '@/components/Button/DisclosureButton';
import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import CreateSemesterModal from '@/components/Modal/CreateSemester';
import LinkButton from '@/components/Button/LinkButton';
import { getSemesters } from '@/services/semesterService';
import { getProgress } from '@/services/userService';

export default function HomeStatus({ session }: SessionProps) {
    const [progress, setProgress] = useState<SemesterProgressType[]>([]);

    const [semesters, setSemesters] = useState<Semester[]>([]);

    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        null
    );

    const [selectedSemesterUrl, setSelectedSemesterUrl] = useState<string>('#');

    const [loadingProgress, setLoadingProgress] = useState<boolean>(false);
    const [loadingSemesters, setLoadingSemesters] = useState<boolean>(false);

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
                    return <p className="font-bold">{cellValue}</p>;
                case 'average':
                    return (
                        <p
                            className={classNames(
                                'font-bold',
                                progressEntry.grade_colour || ''
                            )}
                        >
                            {cellValue || '--'}%
                        </p>
                    );
                case 'num_courses':
                    return cellValue;
                case 'goal':
                    return <p>{cellValue}%</p>;
                default:
                    return cellValue;
            }
        },
        []
    );

    useEffect(() => {
        let mounted = true;
        setLoadingSemesters(true);
        setLoadingProgress(true);
        getSemesters(session, onFailure)
            .then(({ response }) => {
                if (mounted) {
                    const data: Semester[] = response?.data;
                    setSemesters(data || []);

                    setLoadingSemesters(false);
                }
            })
            .catch();

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

    useEffect(() => {
        if (!!selectedSemester) {
            setSelectedSemesterUrl(semesterURL(selectedSemester.id));
        }
    }, [selectedSemester]);

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
                >
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>
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

            {loadingSemesters ? (
                <Spinner label="Loading Semesters..." />
            ) : (
                <Fragment>
                    <div className="w-full sm:mx-auto sm:w-3/4 grid grid-cols-4 gap-2 sm:gap-4">
                        <div className="col-span-3 my-2">
                            {semesters.length ? (
                                <Listbox
                                    value={selectedSemester}
                                    onChange={setSelectedSemester}
                                >
                                    <Listbox.Button
                                        as={DisclosureButton}
                                        className="w-full mb-2"
                                    >
                                        {selectedSemester?.name ||
                                            'Select a Semester'}
                                    </Listbox.Button>
                                    <Transition
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="transition ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options>
                                            {semesters.map((semester) => (
                                                <Listbox.Option
                                                    as={Button}
                                                    key={semester.id}
                                                    value={semester}
                                                    className="w-full my-2 mx-auto focus:bg-warning-100"
                                                >
                                                    {semester.name}
                                                </Listbox.Option>
                                            ))}
                                            <Listbox.Button
                                                as={ConfirmButton}
                                                endContent={
                                                    <PlusIcon className="h-6 w-6"></PlusIcon>
                                                }
                                                className="w-full my-2 mx-auto focus:bg-warning-100"
                                                onPressEnd={onOpen}
                                            >
                                                Create New Semester
                                            </Listbox.Button>
                                        </Listbox.Options>
                                    </Transition>
                                </Listbox>
                            ) : (
                                <ConfirmButton
                                    endContent={
                                        <PlusIcon className="h-6 w-6"></PlusIcon>
                                    }
                                    onPressEnd={onOpen}
                                >
                                    Create New Semester
                                </ConfirmButton>
                            )}
                        </div>
                        <LinkButton
                            isDisabled={!selectedSemester}
                            confirm
                            href={selectedSemesterUrl}
                            className="my-2"
                        >
                            Let's go!
                        </LinkButton>
                    </div>
                </Fragment>
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
