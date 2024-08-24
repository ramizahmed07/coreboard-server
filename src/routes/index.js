const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const auth = require('../middlewares/auth');
const { uploadFile } = require('../lib/multer');

const asyncHandler =
  (fn) =>
  (...args) => {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

router.post('/signup', asyncHandler(controllers.signUp));

router.post('/login', asyncHandler(controllers.login));

router.post('/forgot', asyncHandler(controllers.forgotPassword));

router.post(
  '/reset-password/:resetToken',
  asyncHandler(controllers.resetPassword)
);

router.delete('/logout', auth, asyncHandler(controllers.logout));

router.get('/profile', auth, asyncHandler(controllers.profile));

router.get(
  '/get-teacher-students',
  auth,
  asyncHandler(controllers.getTeacherStudents)
);

router.get('/get-student/:id', auth, asyncHandler(controllers.getStudent));

router.post('/create-student', auth, asyncHandler(controllers.createStudent));

router.post('/delete-student', auth, asyncHandler(controllers.deleteStudent));

router.post('/update-student', auth, asyncHandler(controllers.updateStudent));

router.get('/get-board/:id', auth, asyncHandler(controllers.getBoard));

router.post('/create-board', auth, asyncHandler(controllers.createBoard));

router.post(
  '/upload',
  auth,
  uploadFile.single('file'),
  asyncHandler(controllers.upload)
);

module.exports = router;
