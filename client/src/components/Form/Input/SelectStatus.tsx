import {
    Select as BaseSelect,
    SelectItem,
    SelectVariantProps,
} from '@heroui/react';
import { ReactElement, ReactNode, useState } from 'react';
import {
    FieldValues,
    UseControllerProps,
    useController,
} from 'react-hook-form';

import { createStatusObjects } from '@/lib/helpers';
import { ItemStatus } from '@/types';

import StatusChip from '../../Chip/StatusChip';

interface SelectStatusProps<T extends FieldValues>
    extends UseControllerProps<T>,
        Omit<SelectVariantProps, 'isInvalid' | 'isDisabled'> {
    label?: ReactNode;
    className?: string;
    items: ItemStatus[];
}

export default function SelectStatus<T extends FieldValues>({
    className,
    items,
    ...props
}: SelectStatusProps<T>): ReactElement {
    const { field } = useController(props);

    const statuses = createStatusObjects(items);
    const [value, setValue] = useState<ItemStatus>(
        statuses.at(0)?.key ?? ItemStatus.NOT_STARTED
    );

    function handleSelectionChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (!e.target.value) {
            return;
        }
        field.onChange(e.target.value as ItemStatus);
        setValue(e.target.value as ItemStatus);
    }

    return (
        <BaseSelect
            className={className}
            items={statuses}
            selectedKeys={[value]}
            {...field}
            onChange={handleSelectionChange}
            renderValue={(items) => {
                return items.map((status, index) => {
                    return (
                        <StatusChip
                            key={status.key}
                            status={
                                (status.key as ItemStatus) ||
                                statuses.at(0)?.key ||
                                ItemStatus.NOT_STARTED
                            }
                        />
                    );
                });
            }}
            classNames={{
                label: 'group-data-[filled=true]:-translate-y-5',
                trigger: 'min-h-16 h-fit border-solid border-2',
                listboxWrapper: 'max-h-[400px]',
            }}
            {...props}
        >
            {(status) => (
                <SelectItem key={status.key} textValue={status.label}>
                    <StatusChip status={status.key} />
                </SelectItem>
            )}
        </BaseSelect>
    );
}
