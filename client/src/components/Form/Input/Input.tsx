import { Input as BaseInput, InputVariantProps } from '@heroui/react';
import { ReactElement, ReactNode } from 'react';
import {
    FieldValues,
    UseControllerProps,
    useController,
} from 'react-hook-form';

interface InputProps<T extends FieldValues>
    extends UseControllerProps<T>,
        Omit<InputVariantProps, 'isInvalid' | 'isDisabled'> {
    label?: ReactNode;
    type?: 'text' | 'email' | 'url' | 'password' | 'tel' | 'search' | 'file';
    className?: string;
}

export function Input<T extends FieldValues>({
    className,
    ...props
}: InputProps<T>): ReactElement {
    const {
        field: { disabled, ...field },
        fieldState: { error, invalid, ...fieldState },
    } = useController(props);
    return (
        <BaseInput
            className={className}
            defaultValue={props.defaultValue}
            {...props}
            errorMessage={error?.message}
            validationBehavior="aria"
            isInvalid={invalid}
            isDisabled={disabled}
            {...field}
            {...fieldState}
        />
    );
}
