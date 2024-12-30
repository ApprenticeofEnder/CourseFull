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

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateSemester(onClose: CallableFunction) {
        setIsLoading(true);
        await updateSemester(
            updatedSemester as Updated<Semester>,
            session
        );
        onClose();
        location.reload();
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
                                handleUpdateSemester(onClose);
                            }}
                            isLoading={isLoading}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
