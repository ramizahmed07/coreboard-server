const database = require('../database');
const { hashPassword } = require('../utils');

const updateUser = async (req, res) => {
  try {
    const usersColl = database.users();
    const ObjectID = database.ObjectID();

    const updates = {};
    if (req.body.username) {
      updates.username = req.body.username;
    }
    if (req.body.password) {
      const password = await hashPassword(req.body.password);
      updates.password = password;
    }
    if (req.body.voice) {
      updates.voice = req.body.voice;
    }

    await usersColl.findOneAndUpdate(
      { _id: new ObjectID(req.body._id) },
      { $set: updates }
    );
    const student = await usersColl.findOne({
      _id: new ObjectID(req.body._id),
    });

    return res.status(200).send({ student });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = updateUser;
