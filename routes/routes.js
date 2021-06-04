const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../verifyToken');

//post section
router.get('/api/allposts', verifyToken, userController.findAllPosts);
router.get('/api/allApprovedPosts', userController.findAllApprovedPosts);
router.get('/api/post/:post_id', verifyToken, userController.findPostById);


router.post('/api/createPost', verifyToken, userController.createPost);

router.put('/api/updatePost', verifyToken, userController.updatePost);
router.put('/api/approvePost', verifyToken, userController.approvePost);

router.delete('/api/deletePostComments', userController.deletePostComments);
router.delete('/api/deletePost', verifyToken, userController.deletePost);

router.put('/api/putLikes', verifyToken, userController.putLikes);

//comment section
router.post('/api/createComment', verifyToken, userController.createComment);
router.put('/api/createReply', verifyToken, userController.putReply);


router.delete('/api/deleteComment', userController.deleteComment);

router.get('/api/allPostComments/:post_id', verifyToken, userController.findAllPostComments);

//user section
router.post('/api/register', userController.createUser);
router.post('/api/login', userController.findUser);
router.post('/api/logout', (req, res) => {
    res.cookie()
    res.cookie('userInfo', null, { maxAge: 0, overwrite: true }); //removing userInfo cookie
    res.json({ msg: "logout successfully!" });
});
router.get('/api/getUserPosts/:userId', verifyToken, userController.findUserPosts);




module.exports = router;