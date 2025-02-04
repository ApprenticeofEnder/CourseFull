import {
    Textarea as BaseTextArea,
    TextAreaProps as BaseTextAreaProps,
    InputVariantProps,
} from '@heroui/react';
import { ReactElement, ReactNode } from 'react';
import {
    FieldValues,
    UseControllerProps,
    useController,
} from 'react-hook-form';

interface TextAreaProps<T extends FieldValues>
    extends UseControllerProps<T>,
        Omit<InputVariantProps, 'isInvalid' | 'isDisabled'> {
    label?: ReactNode;
    className?: string;
    placeholder?: string;
    description?: string;
}
