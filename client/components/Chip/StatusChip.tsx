import { Chip } from '@nextui-org/react';

import { ItemStatus } from '@coursefull';
import { ReadableStatus } from '@lib/helpers';

interface StatusChipProps {
    status: ItemStatus;
}

function getChipColour(status: ItemStatus) {
    switch (status) {
        case ItemStatus.NOT_STARTED:
            return 'default';
        case ItemStatus.ACTIVE:
            return 'primary';
        case ItemStatus.COMPLETE:
            return 'success';
        case ItemStatus.OVERDUE:
            return 'danger';
    }
}

export default function StatusChip({ status }: StatusChipProps) {
    return (
        <Chip
            classNames={{
                content: 'font-bold',
            }}
            size='lg'
            color={getChipColour(status)}
            variant="solid"
        >
            {ReadableStatus(status)}
        </Chip>
    );
}
