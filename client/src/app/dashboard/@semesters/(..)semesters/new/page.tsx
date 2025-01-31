'use client';

import { useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';

import NewSemesterModal from '@/components/Modal/NewSemester';
import { Endpoints } from '@/types';

export default function Page() {
    const router = useRouter();
    const newSemesterModal = useDisclosure({
        defaultOpen: true,
        onClose() {
            router.push(Endpoints.Page.DASHBOARD);
        },
    });
    const {
        onOpen,
        isControlled,
        getButtonProps,
        getDisclosureProps,
        ...modalProps
    } = newSemesterModal;
    return <NewSemesterModal {...modalProps} />;
}
