const database = require('../database')
const { hashPassword } = require('../utils')

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    const token = req.params.resetToken
    const usersColl = database.users()
    const resetPasswordColl = database.resetPasswordRequests()
    const ObjectID = database.ObjectID()

    const resetPassRecord = await resetPasswordColl.findOne(
      { resetToken: token },
    )
    if (!resetPassRecord) {
      return res.status(200).send('Reset link has expired, please try again!')
    }

    const newPass = await hashPassword(password)

    await Promise.all([
      resetPasswordColl.deleteMany({ resetToken: token }),
      usersColl.findOneAndUpdate(
        { _id: new ObjectID(resetPassRecord.userId) },
        { $set: { password: newPass } },
      )
    ])

    return res.status(200).send('Password updated successfully! Please sign in using the updated password.')
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error')
  }
}

module.exports = resetPassword