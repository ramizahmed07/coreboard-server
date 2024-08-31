const database = require('../database');
const { hashPassword } = require('../utils');

const createStudent = async (req, res) => {
  try {
    const usersColl = database.users();
    const ObjectID = database.ObjectID();

    const password = await hashPassword(req.body.password);
    const updates = {
      username: req.body.username,
      password,
      role: req.body.role,
      voice: req.body.voice,
      createdAt: new Date(),
      teacherId: new ObjectID(req.user._id),
    };
    await usersColl.insertOne(updates);

    const students = await usersColl
      .find(
        { role: 'student', teacherId: new ObjectID(req.user._id) },
        { projection: { username: 1 } }
      )
      .toArray();
    return res.status(200).send({ students });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = createStudent;
