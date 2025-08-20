import { Input } from '@/components/input';
import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from '@heroui/link';
import { useLazyCurrentQuery, useLoginMutation } from '@/app/services/userApi';
import { ErrorMessage } from '@/components/error-message';
import { hasErrorField } from '@/utils/has-error-field';

type Login = {
    email: string;
    password: string;
}

type Props = {
    setSelected: (value: string) => void;
}
export const Login: React.FC<Props> = ({ setSelected }) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<Login>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [triggerCurrentQuery] = useLazyCurrentQuery();

    const onSubmit = async (data: Login) => {
        try {
            await login(data).unwrap();
            await triggerCurrentQuery().unwrap();
            navigate('/')
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
                No account? {' '}
                <Link
                    
                    className='text-sm font-medium text-primary cursor-pointer '
                    onClick={() => setSelected('register')}
                >
                    Register
                </Link>
            </p>
            <div className="flex gap-2 justify-end w-full">
                <Button fullWidth color='primary' type='submit' isLoading={isLoading}>
                    Login
                </Button>
            </div>
        </Form>
    )
}
