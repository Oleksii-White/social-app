import React, { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { Input as HeroUiInput } from '@heroui/input';

type Props = {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    control: Control<any>;
    required?: string;
    endContent?: JSX.Element;
    error?: string;
};

export const Input: React.FC<Props> = ({
    name,
    label,
    placeholder,
    type,
    control,
    required,
    endContent,
}) => {
    const [showPlaceholder, setShowPlaceholder] = useState(false);

    const {
        field,
        fieldState: { invalid },
        formState: { errors }
    } = useController<any>({
        name,
        control,
        rules: { required }
    });

    return (
        <HeroUiInput
            id={name}
            label={label}
            type={type}
            placeholder={showPlaceholder ? placeholder : ''}
            value={field.value}
            name={field.name}
            isInvalid={invalid}
            onChange={field.onChange}
            onBlur={() => {
                field.onBlur();
                setShowPlaceholder(false);
            }}
            onFocus={() => setShowPlaceholder(true)}
            errorMessage={
                typeof errors[name]?.message === 'string'
                    ? errors[name]?.message
                    : ''
            }
            endContent={endContent}
        />
    );
};
