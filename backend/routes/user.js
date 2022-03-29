const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);  
router.post('/login', userCtrl.login);    
router.delete('/accountView/:id', auth, multer, userCtrl.deleteUser);  
router.get('/accountView/:id', auth, userCtrl.getOneUser);  
router.put('/accountView/:id',auth, multer, userCtrl.modifyUser);  
router.get('/', auth, userCtrl.getAllUsers); 
router.put('/accountView/:id', auth, userCtrl.modifyPassword); 

module.exports = router;