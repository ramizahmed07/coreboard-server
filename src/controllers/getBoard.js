const database = require('../database');

const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const boardsColl = database.boards();
    const ObjectID = database.ObjectID();
    const board = await boardsColl.findOne({
      studentId: new ObjectID(id),
    });
    return res.status(200).send({ board });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = getBoard;
