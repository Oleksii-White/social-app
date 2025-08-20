import React, { useState } from 'react'
import { Form } from '@heroui/form';
import { Input } from '@/components/input';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '@/app/services/userApi';
import { hasErrorField } from '@/utils/has-error-field';
import { ErrorMessage } from '@/components/error-message';

type Register = {
    email: string;
    password: string;
    name: string;
}
type Props = {
    setSelected: (value: string) => void;
}
export const Register: React.FC<Props> = ({
    setSelected
}) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<Register>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            name: ''
        }
    });

    const [register, { isLoading }] = useRegisterMutation();
    const [error, setError] = useState('');

    const onSubmit = async (data: Register) => {
        try {
            await register(data).unwrap();
            setSelected('login');
        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error);
            } else {
                setError(String(error));
            }
        }
    }
    return (
        <Form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                name='name'
                label='Name'
                type='text'
                placeholder='Required field'
                required={'Name is required'}
            />
            <Input
                control={control}
                name='email'
                label='Email'
                type='email'
                placeholder='Required field'
                required={'Email is required'}
                error={errors.email?.message}
            />
            <Input
                control={control}
                name='password'
                label='Password'
                type='password'
                placeholder='Required field'
                required={'Password is required'}
                error={errors.password?.message}

            />

            <ErrorMessage error={error} />

            <p className="w-full text-small text-center">
                Already have an account? {' '}
                <Link

                    className='text-sm font-medium text-primary cursor-pointer '
                    onClick={() => setSelected('login')}
                >
                    Login
                </Link>
            </p>
            <div className="flex gap-2 justify-end w-full">
                <Button fullWidth color='primary' type='submit' isLoading={isLoading}>
                    Register
                </Button>
            </div>
        </Form>
    )
}
