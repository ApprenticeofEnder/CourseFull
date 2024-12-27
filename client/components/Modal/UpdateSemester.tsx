import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { ItemStatus, Semester } from '@coursefull';
import { SessionProps } from '@coursefull';
import SemesterForm from '../Form/SemesterForm';
import { updateSemester } from '@services/semesterService';

interface EditSemesterModalProps extends SessionProps {
    semester: Semester | null;
}

export default function UpdateSemesterModal({
    session,
    semester,
}: EditSemesterModalProps) {
    const [name, setName] = useState<string>(semester?.name || '');
    const [status, setStatus] = useState<ItemStatus>(
        semester?.status || ItemStatus.NOT_STARTED
    );
    const [goal, setGoal] = useState<string>(semester?.goal.toString() || '');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateSemester(onClose: CallableFunction) {
        setIsLoading(true);
        await updateSemester(
            {
                id: semester?.id,
                name,
                status,
                goal: parseFloat(goal),
            },
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
                            name={name}
                            setName={setName}
                            status={status}
                            setStatus={setStatus}
                            goal={goal}
                            setGoal={setGoal}
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
