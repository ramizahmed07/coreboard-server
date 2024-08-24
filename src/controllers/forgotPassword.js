const database = require('../database');
const { emailRegex, forgotPasswordEmail } = require('../utils');

const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const usersColl = database.users();
    const resetPasswordColl = database.resetPasswordRequests();
    const ObjectID = database.ObjectID();

    const user = await usersColl.findOne({ username });
    if (!user) {
      return res.status(200).send('User with username not found!');
    }
    if (!emailRegex.test(user.username)) {
      return res
        .status(200)
        .send('Username must be an email. Please contact support!');
    }

    const resetToken = new ObjectID().toString();
    await forgotPasswordEmail({ email: user.username, resetToken });

    const userId = new ObjectID(user._id);
    const filter = { userId };
    const update = {
      userId,
      resetToken,
      username: user.username,
      createdAt: new Date(),
    };
    const options = { upsert: true };
    await resetPasswordColl.findOneAndReplace(filter, update, options);

    return res
      .status(200)
      .send(
        'An email has been sent with the reset password link. The link will expire in 15 mins.'
      );
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = forgotPassword;
