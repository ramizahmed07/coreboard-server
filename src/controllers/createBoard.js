const database = require('../database');

const createBoard = async (req, res) => {
  try {
    const boardsColl = database.boards();
    const ObjectID = database.ObjectID();

    const filter = { studentId: new ObjectID(req.body.studentId) };

    // Fetch the board
    const existingBoard = await boardsColl.findOne(filter);

    if (existingBoard) {
      // If the board exists, update it
      const updateData = {
        $set: {
          pages: req.body.pages,
          updatedAt: new Date(),
        },
      };
      await boardsColl.updateOne(filter, updateData);
    } else {
      // If the board doesn't exist, create a new one
      const newData = {
        studentId: new ObjectID(req.body.studentId),
        pages: req.body.pages,
        createdAt: new Date(),
      };
      await boardsColl.insertOne(newData);
    }

    const boards = await boardsColl
      .find({ studentId: new ObjectID(req.body.studentId) })
      .toArray();
    return res.status(200).send({ boards });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = createBoard;
