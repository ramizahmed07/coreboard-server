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
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(sendgridApiKey);
  const msg = {
    template_id: 'd-b966dbce146d4077b88710bfe1e0415a',
    from: emailFrom,
    personalizations: [
      {
        to: { email },
        dynamic_template_data: {
          email,
        },
      },
    ],
  };
  await sgMail.send(msg);
};

const forgotPasswordEmail = async ({ email, resetToken }) => {
  const emailFrom = process.env.EMAIL_FROM;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const clientUri = process.env.CLIENT_APP_URI;
  sgMail.setApiKey(sendgridApiKey);
  const resetPasswordLink = `${clientUri}/reset-password/${resetToken}`;
  const msg = {
    template_id: 'd-d27a9a31c86e4282bb94a75168536a9b',
    from: emailFrom,
    personalizations: [
      {
        to: { email },
        dynamic_template_data: {
          email,
          reset_password_link: resetPasswordLink,
        },
      },
    ],
  };
  await sgMail.send(msg);
};

module.exports = {
  generateRandomToken,
  hashPassword,
  generateAuthToken,
  signupEmail,
  forgotPasswordEmail,
  emailRegex,
};
