import { User } from "@/app/types";
import { useContext, useState } from "react";
import { ThemeContext } from "../theme-provider";
import { useUpdateUserMutation } from "@/app/services/userApi";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { MdOutlineEmail } from "react-icons/md";
import { Input } from "../input";
import { Textarea } from "@heroui/input";
import { ErrorMessage } from "../error-message";
import { Button } from "@heroui/button";
import { hasErrorField } from "@/utils/has-error-field";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user?: User
}

type FormUser = Omit<User, 'dateOfBirth' | 'createdAt' | 'updatedAt' | 'posts' | 'following' | 'followers' | 'likes' | 'comments'> & {
    dateOfBirth?: string;
};

export const EditProfile: React.FC<Props> = ({
    isOpen,
    onClose,
    user
}) => {
    const { theme } = useContext(ThemeContext)
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>();

    const { handleSubmit, control } = useForm<FormUser>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: user?.email ?? '',
            name: user?.name ?? '',
            dateOfBirth: user?.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().split('T')[0]
                : '',
            bio: user?.bio ?? '',
            location: user?.location ?? ''
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setSelectedFile(e.target.files[0])
        }
    }

    const onSubmit = async (data: FormUser) => {
        if (id) {
            try {
                const formData = new FormData();
                data.name && formData.append('name', data.name);
                data.email && data.email !== user?.email && formData.append('email', data.email)

                if (data.dateOfBirth) {
                    const date = new Date(data.dateOfBirth);
                    if (!isNaN(date.getTime())) {
                        formData.append('dateOfBirth', date.toISOString());
                    }
                }

                data.bio && formData.append('bio', data.bio);
                data.location && formData.append('location', data.location);
                selectedFile && formData.append('avatar', selectedFile);

                await updateUser({ userData: formData, id }).unwrap();
                onClose()
            } catch (error) {
                if (hasErrorField(error)) {
                    setError(error.data.error)
                }
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`${theme} text-foreground`}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Edit profile
                </ModalHeader>
                <ModalBody>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            control={control}
                            name='email'
                            label='Email'
                            type='email'
                            endContent={<MdOutlineEmail />}
                        />
                        <Input
                            control={control}
                            name='name'
                            label='Name'
                            type='text'
                        />
                        <input
                            type='file'
                            name='avatarUrl'
                            placeholder='Choice the picture'
                            onChange={handleFileChange}

                        />
                        <Input
                            control={control}
                            name='dateOfBirth'
                            label='Date of birth'
                            type='date'
                            placeholder="My B-Day"
                        />
                        <Controller
                            name='bio'
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Your biography"
                                />
                            )}
                        />
                        <Input
                            control={control}
                            name='location'
                            label='Location'
                            type='text'
                        />
                        <ErrorMessage error={error} />
                        <div className="flex gap-2 justify-end">
                            <Button
                                fullWidth
                                color='primary'
                                type="submit"
                                isLoading={isLoading}
                            >
                                Update profile
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}