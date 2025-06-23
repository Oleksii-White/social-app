import { useGetAllPostsQuery } from '@/app/services/postsApi'
import { Card } from '@/components/card';
import { CreatePost } from '@/components/createPost';

export const Posts = () => {

  const { data, refetch } = useGetAllPostsQuery();

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      {
        data && data.length > 0 ?
          data.map(({
            content,
            author,
            id,
            comments,
            likes,
            likeByUser,
            createdAt
          }) => (
            <Card
              key={id}
              avatarUrl={author.avatarUrl ?? ''}
              content={content}
              name={author.name ?? ''}
              likesCount={likes.length}
              commentsCount={comments.length}
              authorId={author.id}
              id={id}
              likedByUser={likeByUser}
              createdAt={createdAt}
              cardFor='post'
              refetchPosts={refetch}
            />
          )) : null
      }
    </>
  )
}
