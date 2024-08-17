const profile = async (req, res) => {
  try {
    const { user } = req;
    const updatedUser = { ...user };
    if (req?.passBack) return updatedUser;
    return res.send({ user: updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = profile;
