import { Form } from '@heroui/react';
import { useFormContext } from 'react-hook-form';

import { SemesterSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

import { Input, NumberInput, SelectStatus } from './Input';

export default function SemesterForm() {
    const { control } = useFormContext<SemesterSchema>();

    return (
        <Form>
            <Input control={control} name="name" label="Semester Name" />
            <NumberInput
                control={control}
                name="goal"
                label="Goal"
                min={0}
                max={100}
                step={0.5}
            />
            <SelectStatus
                control={control}
                name="status"
                items={[
                    ItemStatus.NOT_STARTED,
                    ItemStatus.ACTIVE,
                    ItemStatus.COMPLETE,
                ]}
                label="Status"
            />
        </Form>
    );
}
