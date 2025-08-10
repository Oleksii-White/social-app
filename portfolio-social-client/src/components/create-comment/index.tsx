import { useLazyGetPostByIdQuery } from '@/app/services/postsApi'
import { useCreateCommentMutation } from '@/app/services/commentsApi';
import { Textarea } from '@heroui/input';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@heroui/button';
import { IoMdCreate } from 'react-icons/io';
import { useParams } from 'react-router-dom';

type FormValues = {
  comment: string;
};

export const CreateComment = () => {
  const { id } = useParams<{ id: string }>();
  const [createComment] = useCreateCommentMutation();
  const [getPostById] = useLazyGetPostByIdQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm<FormValues>();


  const onSubmit = async (data: FormValues) => {
    try {
      if (id) {
        await createComment({ content: data.comment, postId: id }).unwrap();
        setValue('comment', '');
        await getPostById(id).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className='flex-grow' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='comment'
        control={control}
        defaultValue=''
        rules={{ required: 'Content is required' }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement='outside'
            placeholder='Write your comment'
            className='mb-5'
            isInvalid={!!errors.comment}
            errorMessage={errors.comment?.message}
          />
        )}
      />
      <Button
        color='primary'
        className='flex-end'
        endContent={<IoMdCreate />}
        type='submit'
      >
        Reply...
      </Button>
    </form>
  );
};
