import {
    Modal as BaseModal,
    ModalProps as BaseModalProps,
    cn,
} from '@heroui/react';
import { forwardRef } from 'react';

export type ModalProps = Omit<BaseModalProps, 'children'>;

const Modal = forwardRef<HTMLElement | null, BaseModalProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <BaseModal
                ref={ref}
                className={cn('bg-primary-900', className)}
                {...props}
            >
                {children}
            </BaseModal>
        );
    }
);

Modal.displayName = 'Modal';

export default Modal;
