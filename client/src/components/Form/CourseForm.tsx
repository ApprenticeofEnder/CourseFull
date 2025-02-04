import { Form } from '@heroui/react';
import { useFormContext } from 'react-hook-form';

import { CourseSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

import { Input, SelectStatus } from './Input';

export default function CourseForm() {
    const { control } = useFormContext<CourseSchema>();

    return (
        <Form>
            <Input
                control={control}
                name="course_code"
                label="Course Code"
                isRequired
                placeholder="PSYC 1001"
            />
            <Input
                control={control}
                name="title"
                label="Title"
                isRequired
                placeholder="Introduction to Psychology"
                description="In case you need the full title."
            />
            <SelectStatus
                control={control}
                name="status"
                items={[ItemStatus.ACTIVE, ItemStatus.COMPLETE]}
                label="Status"
            />
        </Form>
    );
}
