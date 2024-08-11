const signUp = require('./signup');
const login = require('./login');
const profile = require('./profile');
const logout = require('./logout');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const getTeacherStudents = require('./getTeacherStudents');
const createStudent = require('./createStudent');
const deleteStudent = require('./deleteStudent');
const updateStudent = require('./updateStudent');
const getStudent = require('./getStudent');
const upload = require('./upload');
const createBoard = require('./createBoard');
const getBoard = require('./getBoard');

module.exports = {
  signUp,
  login,
  profile,
  logout,
  forgotPassword,
  resetPassword,
  getTeacherStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  getStudent,
  upload,
  createBoard,
  getBoard,
};
