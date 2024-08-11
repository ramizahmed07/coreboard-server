const database = require('../database');

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const usersColl = database.users();
    const ObjectID = database.ObjectID();
    const student = await usersColl.findOne({
      _id: new ObjectID(id),
    });
    return res.status(200).send({ student });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = getStudent;
