import { useGetPostByIdQuery } from '@/app/services/postsApi';
import { Card } from '@/components/card';
import { CreateComment } from '@/components/create-comment';
import { GoBack } from '@/components/go-back';
import { useParams } from 'react-router-dom'

export const CurrentPost = () => {
  const params = useParams<{ id: string }>();
  const { data, refetch } = useGetPostByIdQuery(params?.id ?? '')

  if (!data) {
    return <h2>Post didnt findet</h2>
  }
  const {
    content,
    id,
    authorId,
    comments,
    likes,
    author,
    likeByUser,
    createdAt
  } = data;

  return (
    <>
      <GoBack />
      <Card
        cardFor='current-post'
        avatarUrl={author.avatarUrl ?? ''}
        content={content}
        name={author.name ?? ''}
        likesCount={likes.length}
        commentsCount={comments.length}
        authorId={authorId}
        id={id}
        likedByUser={likeByUser}
        createdAt={createdAt}
        refetchPosts={refetch}
      />
      <div className="mt-10">
        <CreateComment/>
      </div>
      <div className="mt-10">
        {
          data.comments ?
          data.comments.map((comment) => (
            <Card
              cardFor='comment'
              key={comment.id}
              avatarUrl={comment.user.avatarUrl ?? ''}
              content={comment.content}
              name={comment.user.name ?? ''}
              authorId={comment.userId}
              commentId={comment.id}
              id={id}
              refetchPosts={refetch}
            />
            )) : null
        }
      </div>
    </>
  )
}
