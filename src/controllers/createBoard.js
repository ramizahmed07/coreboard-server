const database = require('../database');

const createBoard = async (req, res) => {
  try {
    const boardsColl = database.boards();
    const ObjectID = database.ObjectID();

    const studentIds = req.body.studentIds; // Array of studentIds
    const pages = req.body.pages; // Array of pages corresponding to each student
    const isAppend = req.body.isAppend; // Array of pages corresponding to each student

    if (!Array.isArray(studentIds) || !Array.isArray(pages)) {
      return res.status(400).send('Invalid input data');
    }

    for (let i = 0; i < studentIds.length; i++) {
      const filter = { studentId: new ObjectID(studentIds[i]) };

      // Fetch the board
      const existingBoard = await boardsColl.findOne(filter);

      if (existingBoard) {
        // If the board exists, update it
        const updateData = {
          $set: {
            pages: isAppend
              ? [...existingBoard.pages, ...req.body.pages]
              : req.body.pages,
            updatedAt: new Date(),
          },
        };
        await boardsColl.updateOne(filter, updateData);
      } else {
        // If the board doesn't exist, create a new one
        const newData = {
          studentId: new ObjectID(studentIds[i]),
          pages: req.body.pages,
          createdAt: new Date(),
        };
        await boardsColl.insertOne(newData);
      }
    }

    // Fetch the updated boards for all studentIds
    const boards = await boardsColl
      .find({ studentId: { $in: studentIds.map((id) => new ObjectID(id)) } })
      .toArray();

    return res.status(200).send({ boards });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = createBoard;
