import { AxiosResponse } from 'axios';
import { Fragment, Key, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { ItemStatus, SessionProps } from '@coursefull';
import { createSemester } from '@services/semesterService';
import SemesterForm from '../Form/SemesterForm';

export default function CreateSemesterModal({ session }: SessionProps) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('80');
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.NOT_STARTED);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateSemester(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await createSemester(
            {
                name,
                goal: parseFloat(goal),
                status,
            },
            session,
            (error) => {
                alert(`Something went wrong: ${error}`);
                setIsLoading(false);
            }
        );
        if (!success) {
            return;
        }
        onClose();
        location.reload();
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Create New Semester
                    </ModalHeader>
                    <ModalBody>
                        <SemesterForm
                            name={name}
                            setName={setName}
                            goal={goal}
                            setGoal={setGoal}
                            status={status}
                            setStatus={setStatus}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            onPress={() => {
                                handleCreateSemester(onClose);
                            }}
                            isLoading={isLoading}
                            buttonType="confirm"
                        >
                            Create!
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
