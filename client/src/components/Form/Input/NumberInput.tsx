import { Input as BaseInput, InputVariantProps } from '@heroui/react';
import { ReactElement, ReactNode, useState } from 'react';
import {
    FieldValues,
    UseControllerProps,
    useController,
} from 'react-hook-form';

interface InputProps<T extends FieldValues>
    extends UseControllerProps<T>,
        Omit<InputVariantProps, 'isInvalid' | 'isDisabled'> {
    label?: ReactNode;
    max?: number;
    min?: number;
    step?: number;
    className?: string;
    placeholder?: number;
}

export default function Input<T extends FieldValues>({
    className,
    placeholder,
    ...props
}: InputProps<T>): ReactElement {
    const {
        field: { disabled, onChange, ...field },
        fieldState: { error, invalid, ...fieldState },
    } = useController(props);

    const [value, setValue] = useState<string>('0');

    return (
        <BaseInput
            className={className}
            defaultValue={props.defaultValue}
            type="number"
            placeholder={placeholder ? placeholder.toString() : '0'}
            onChange={(e) => {
                if (!e.target.value) {
                    return;
                }
                onChange(Number.parseFloat(e.target.value));
                setValue(e.target.value);
            }}
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
