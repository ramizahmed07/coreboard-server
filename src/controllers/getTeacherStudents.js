const database = require('../database');

const getTeacherStudents = async (req, res) => {
  try {
    const usersColl = database.users();
    const ObjectID = database.ObjectID();
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

module.exports = getTeacherStudents;
