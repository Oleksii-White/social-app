const {prisma} = require('../prisma/prisma-client');

const FollowController = {
    followUser: async (req, res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;
        
        if (followingId === userId) {
            return res.status(400).json({message: 'You cannot follow yourself'});
        }

        try {
            const existingSubscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        {followerId: userId},
                        {followingId}
                    ]
                }});
                if (existingSubscription) {
                    return res.status(400).json({message: 'You are already following this user'});
                }
                await prisma.follows.create({
                    data: {
                        follower: { connect: {id: userId}},
                        following: { connect: {id: followingId}}
                    }
                });
                res.status(201).json({message: 'You are now following this user'});
        
            } catch (error) {
            console.error('Error following user:', error);
            res.status(500).json({message: 'Internal server error'});
            
        }
    },
    unFollowUser: async (req, res) => {
        console.log('req.params:', req.params); 
        const followingId = req.params.id; 
        const userId = req.user.userId;
    
        try {
            const follows = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            });
            if (!follows) {
                return res.status(404).json({ message: 'You are not following this user' });
            }
            await prisma.follows.delete({
                where: {
                    id: follows.id
                }
            });
            res.status(200).json({ message: 'You have unfollowed this user' });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = FollowController;