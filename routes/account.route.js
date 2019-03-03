const express = require('express');
const router = express.Router();


const multer = require('multer');
const upload = multer({ dest: './public/uploads/avatars/' })


//Controller
const controller = require('../controllers/account.controller');

/* GET users listing. */
router.get('/', controller.getUser);

router.get('/create', controller.getCreateUser);

router.post('/', upload.single('avatarUser'), controller.postUser);

router.get('/delete/:id', controller.deleteUser);

router.post('/update-form', controller.getUpdateUser);

router.post('/update',upload.single('avatar'), controller.updateUser);


//API
router.delete('/:id', controller.deleteUser);


module.exports = router;
