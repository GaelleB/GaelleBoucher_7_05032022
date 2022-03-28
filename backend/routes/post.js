const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

router.post('/new', auth,  multer, postCtrl.createPost); 
router.put('/:id', auth, multer, postCtrl.modifyPost);  
router.delete('/:id',auth,multer, postCtrl.deletePost) 
router.get('/', auth, postCtrl.getAllPosts)                 
router.get('/:id', auth, postCtrl.getOnePost)               
router.get('/:userId/posts',auth, postCtrl.getPostsUser)
router.post('/:id/vote/like', auth, postCtrl.likePost);
router.post('/:id/vote/dislike', auth, postCtrl.dislikePost);


module.exports = router;