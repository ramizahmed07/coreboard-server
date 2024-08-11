const { compare } = require('bcrypt');

const { generateAuthToken } = require('../utils');
const database = require('../database');
const profile = require('./profile');

const login = async (req, res) => {
  try {
    const userColl = database.users();
    const trimmedUsername = req.body.username.trim();

    // check if email already exists in users collection
    let user = await userColl.findOne({ username: trimmedUsername });

    if (!user) {
      return res.status(400).send('User with username not found');
    }

    const isValidPassword = await compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(400).send('Wrong credentials');
    }

    const authToken = await generateAuthToken(user);

    if (authToken && user?.role === 'teacher') {
      user = await profile({ user, passBack: true });
    }

    if (req?.passBack) {
      return Promise.resolve({
        user,
        token: authToken,
      });
    }

    return res.set({ 'x-authorization': authToken }).send({ user });
  } catch (e) {
    console.log(e);
    if (req?.passBack) {
      return Promise.reject(e);
    }
    return res.status(400).send('Error');
  }
};

module.exports = login;
