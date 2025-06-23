const { prisma } = require('../prisma/prisma-client');


const PostController = {
    createPost: async (req, res) => {
        console.log('Decoded user:', req.user);

        const {content} = req.body;
        const authorId = req.user.userId; // Assuming you have user ID in req.user

        if (!content) {
            return res.status(400).json({error: 'Content is required'});
        }

        try {
            const post = await prisma.post.create({
                data: {
                    content,
                    authorId,
                }
            });
            res.json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getAllPosts: async (req, res) => {
        const userId = req.user.userId;

        try {
            const posts = await prisma.post.findMany({
                include: {
                    likes: true,
                    author: true,
                    comments: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })
            const postwithLikeInfo = posts.map(post => ({
                ...post, 
                likedByUser: post.likes.some(like => like.userId === userId),
                likesCount: post.likes.length,
                commentsCount: post.comments.length,
            }));
            res.json(postwithLikeInfo);
        } catch (error) {
            console.error('Get all posts error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getPostById: async (req, res) => {
        const {id} = req.params;
        const userId = req.user.userId;
        try {
            const post = await prisma.post.findUnique({
                where: {id },
                include: {
                    comments: {
                        include: {
                            user: true,
                    },
                },
                likes: true,
                author: true,
                },
            })
            if (!post) {
                return res.status(404).json({error: 'Post not found'});
            }
            const postWithLikeInfo = {
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId),
                likesCount: post.likes.length,
                commentsCount: post.comments.length,
            };
            res.json(postWithLikeInfo);

        } catch (error) {
            console.error('Get post by ID error:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    deletePost: async (req, res) => {
    try {
        const {id} = req.params;
        const post = await prisma.post.findUnique({
            where: {id}
        });

        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }

        if (String(post.authorId) !== String(req.user.userId)) {
            return res.status(403).json({error: 'You are not authorized to delete this post'});
        }

        const transaction = await prisma.$transaction([
            prisma.comment.deleteMany({ where: { postId: id } }),
            prisma.like.deleteMany({ where: { postId: id } }),
            prisma.post.delete({ where: { id } })
        ]);

        res.json(transaction);

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}
}


module.exports = PostController;