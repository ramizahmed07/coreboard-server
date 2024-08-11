const database = require('../database');

const logout = async (req, res) => {
  try {
    const token = req.get('x-authorization');

    if (!token) return res.sendStatus(401);
    const sessionColl = database.sessions();
    const ObjectID = database.ObjectID();
    await sessionColl.deleteMany({
      $or: [{ token }, { userId: new ObjectID(req.user._id) }],
    });
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = logout;
