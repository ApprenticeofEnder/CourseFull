import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { ItemStatus, Semester, Updated } from '@coursefull';
import { SessionProps } from '@coursefull';
import SemesterForm from '../Form/SemesterForm';
import { updateSemester } from '@services/semesterService';
import assert from 'assert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditSemesterModalProps extends SessionProps {
    semester: Semester | null;
}

export default function UpdateSemesterModal({
    session,
    semester,
}: EditSemesterModalProps) {
    assert(semester);
    assert(semester.id);

    const [updatedSemester, setUpdatedSemester] = useState<Semester>(semester);

    const queryClient = useQueryClient();

    const semesterUpdate = useMutation({
        mutationFn: (semester: Semester) => {
            return updateSemester(
                semester as Updated<Semester>,
                session
            ) as Promise<Updated<Semester>>;
        },
        onSuccess: (semester) => {
            queryClient.invalidateQueries({ queryKey: ['semester', semester.id] });
        },
    });
    if (semesterUpdate.error) {
        throw semesterUpdate.error;
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit Semester
                    </ModalHeader>
                    <ModalBody>
                        <SemesterForm
                            semester={updatedSemester}
                            setSemester={setUpdatedSemester}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            buttonType="confirm"
                            onPress={() => {
                                semesterUpdate.mutate(updatedSemester, {
                                    onSuccess: onClose
                                })
                            }}
                            isLoading={semesterUpdate.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
