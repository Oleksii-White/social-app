const { prisma } = require("../prisma/prisma-client");


const LikeController = {
    likePost: async (req, res) => {
        const { postId } = req.body;
        const userId = req.user.userId;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        try {
            const existingLike = await prisma.like.findFirst({
                where: {
                    postId,
                    userId
                }
            });
            if (existingLike) {
                return res.status(400).json({ message: 'You have already liked this post' });
            }
            const like = await prisma.like.create({
                data: { postId, userId }
            });
            res.json(like);
        } catch (error) {
            console.error('Error liking post:', error);
            return res.status(500).json({ message: 'Error with liking post' });
        }
    },
    unlikePost: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        if (!id) {
            return res.status(400).json({ message: 'Post ID is required for unliking' });
        }

        try {
            const existingLike = await prisma.like.findFirst({
                where: { postId: id, userId }
            });

            if (!existingLike) {
                return res.status(400).json({ message: 'You have not liked this post yet' });
            }

            await prisma.like.deleteMany({
                where: { postId: id, userId }
            });
            return res.status(200).json({ message: 'Like removed successfully' });

        } catch (error) {
            console.error('Error unliking post:', error);
            res.status(500).json({ error: "Something wrong with unliking post" });
        }
    }


}

module.exports = LikeController;