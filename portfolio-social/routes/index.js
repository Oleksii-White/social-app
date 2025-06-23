const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, PostController, CommentController, LikeController, FollowController } = require('../controllers');
const authenticateToken = require('../middleware/auth');

const uploadDestination = 'uploads/'; 

//storage for multer
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function(req, file, cb) {
        cb(null, file.originalname); // сохраняем файл с оригинальным именем
    }
});

const uploads = multer({ storage: storage});
// user routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.put('/users/:id', authenticateToken, UserController.updateUser);

//post routes
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

// comment routes
router.post('/comment/', authenticateToken, CommentController.createComment);
router.delete('/comment/:id', authenticateToken, CommentController.deleteComment);


//like routes
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);

//follow routes
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete('/unfollow/:id', authenticateToken, FollowController.unFollowUser);

module.exports = router;