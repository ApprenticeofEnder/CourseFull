import { Form } from '@heroui/react';
import { useFormContext } from 'react-hook-form';

// import { createStatusObjects } from '@/lib/helpers';
import { CourseSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

// import { ItemStatus } from '@/types';

import { Input } from './Input/Input';
import { SelectStatus } from './Input/SelectStatus';

export default function CourseForm() {
    const { control } = useFormContext<CourseSchema>();

    return (
        <Form>
            <Input control={control} name="course_code" label="Course Code" />
            <Input control={control} name="title" label="Title" isRequired />
            <SelectStatus
                control={control}
                name="status"
                items={[ItemStatus.ACTIVE, ItemStatus.COMPLETE]}
                label="Status"
            />
        </Form>
    );
}
