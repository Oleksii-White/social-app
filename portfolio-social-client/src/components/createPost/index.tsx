import { useCreatePostMutation, useLazyGetAllPostsQuery } from '@/app/services/postsApi'
import { Textarea } from '@heroui/input';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '../error-message';
import { Button } from '@heroui/button';
import { IoMdCreate } from 'react-icons/io';

export const CreatePost = () => {

    const [createPost] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm();

    const error = errors?.post?.message as string;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createPost({content: data.post}).unwrap();
            setValue('post', '');
            await triggerAllPosts().unwrap();
        } catch (error) {
            console.log(error);
            
        }
    })

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='post'
                control={control}
                defaultValue={''}
                rules={{
                    required: 'Post content is required',
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='What is on your mind?'
                        className='mb-5'
                    />
                )}
            />
            {error && <ErrorMessage error={error} />}
            <Button
                color='success'
                className='flex-end'
                endContent={<IoMdCreate />}
                type='submit'
            >
                Create Post
            </Button>
        </form>
    )
}
