import { Chip } from '@nextui-org/react';

import { readableStatus } from '@/lib/helpers';
import { ItemStatus } from '@/types';

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
        case ItemStatus.URGENT:
            return 'warning';
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
            size="lg"
            color={getChipColour(status)}
            variant="solid"
        >
            {readableStatus(status)}
        </Chip>
    );
}
