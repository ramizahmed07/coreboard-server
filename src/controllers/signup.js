const database = require('../database');
const { hashPassword, signupEmail, emailRegex } = require('../utils');
const login = require('./login');

const signUp = async (req, res) => {
  try {
    const ObjectID = database.ObjectID();
    const userColl = database.users();
    const trimmedUsername = req.body.username.trim();
    // check if email already exists in users collection
    const userExists = await userColl.findOne({ username: trimmedUsername });

    if (userExists) {
      return res.status(400).send('User with username already exists');
    }

    const password = await hashPassword(req.body.password);

    const data = {
      role: req.body.role,
      username: trimmedUsername,
      password,
      voice: req.body.voice,
      createdAt: new Date(),
      teacherId: new ObjectID(req.body.teacher),
    };

    await userColl.insertOne(data);

    req.passBack = true;

    const loginData = await login(req, res);
    const token = loginData.token;
    delete loginData.token;

    if (emailRegex.test(trimmedUsername)) {
      signupEmail({ email: trimmedUsername });
    }

    return res.set({ 'x-authorization': token }).send(loginData);
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = signUp;
