const { genSalt, hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const database = require('../database');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

const generateRandomToken = (bytes = 256) => {
  const buf = randomBytes(bytes);
  const token = buf.toString('hex');
  return token;
};

const hashPassword = async (plainTextPassword) => {
  const salt = await genSalt(10);
  const hashed = await hash(plainTextPassword, salt);
  return hashed;
};

const generateAuthToken = async (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const ObjectID = database.ObjectID();
  const usersColl = database.users();
  const sessionColl = database.sessions();
  const userId = user._id;
  const token = sign(
    { _id: userId },
    jwtSecret,
    { expiresIn: 60 * 60 * 8 } // 8 hours
    // { expiresIn: 10 }, // 10 seconds - for testing purposes only
  ).toString();
  const filter = {
    _id: new ObjectID(userId),
  };
  const isUser = await usersColl.findOne(filter);
  if (!isUser) throw new Error('User not found');
  const sessionData = {
    userId,
    token,
    role: user.role,
    createdAt: new Date(),
  };
  await sessionColl.insertOne(sessionData);
  return Promise.resolve(token);
};

const signupEmail = async ({ email }) => {
  const emailFrom = process.env.EMAIL_FROM;

  try {
    const msg = {
      template_id: 'd-dd6b83ca1d174452aa2a408c49343c86',
      from: emailFrom,
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: {
            username: email,
          },
        },
      ],
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

const forgotPasswordEmail = async ({ email, resetToken }) => {
  const emailFrom = process.env.EMAIL_FROM;

  const clientUri = process.env.REACT_APP_URI;

  const resetPasswordLink = `${clientUri}/reset-password/${resetToken}`;

  try {
    const msg = {
      template_id: 'd-e498947b37dc48078d57513fe34691d3',
      from: emailFrom,
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: {
            link: resetPasswordLink,
          },
        },
      ],
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = {
  generateRandomToken,
  hashPassword,
  generateAuthToken,
  signupEmail,
  forgotPasswordEmail,
  emailRegex,
};
