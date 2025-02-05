import { Form } from '@heroui/react';
import { useFormContext } from 'react-hook-form';

import { DeliverableSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

import { Input, NumberInput, SelectStatus } from './Input';

export default function DeliverableForm() {
    const { control, getValues } = useFormContext<DeliverableSchema>();

    return (
        <Form>
            <Input
                control={control}
                name="name"
                label="Deliverable Name"
                isRequired
                placeholder="Assignment 1"
            />
            <div className="flex w-full flex-wrap gap-4">
                <NumberInput
                    control={control}
                    name="weight"
                    label="Weight"
                    isRequired
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder={10}
                    className="w-fit flex-grow"
                />
                <NumberInput
                    control={control}
                    name="mark"
                    label="Mark"
                    isRequired
                    min={0}
                    max={100}
                    step={0.1}
                    disabled={getValues('status') !== ItemStatus.COMPLETE}
                    className="w-fit flex-grow"
                />
            </div>
            <SelectStatus
                control={control}
                name="status"
                label="Status"
                items={[ItemStatus.ACTIVE, ItemStatus.COMPLETE]}
            />
            {/* TODO: Add date inputs + notes */}
        </Form>
    );
}
