import { Button as HerouiButton } from '@heroui/button';
import React from 'react'

type Props = {
    children: React.ReactNode;
    icon?: JSX.Element;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;
}

export const Button: React.FC<Props> = ({
    children,
    className,
    color,
    icon,
    fullWidth,
    type
}) => {

    return (
        <HerouiButton
            startContent={icon}
            size='lg'
            color={color}
            variant='solid'
            className={className}
            type={type}
            fullWidth={fullWidth}
        >
            {children}
        </HerouiButton>
    )
}
