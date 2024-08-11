const { verify } = require('jsonwebtoken')

const database = require('../database')

const auth = async (req, res, next) => {
  const token = req.get('x-authorization')
  if (!token) return res.sendStatus(401)
  const sessionsColl = database.sessions()
  try {
    const usersColl = database.users()
    const ObjectID = database.ObjectID()
    const jwtSecret = process.env.JWT_SECRET

    const decoded = verify(token, jwtSecret)
    
    const sessions = await sessionsColl.find({
      userId: new ObjectID(decoded._id),
      token,
    }).sort({ $natural: -1 }).limit(1).toArray()

    if (!sessions?.length) return res.status(401).send('Unauthorized')

    const user = await usersColl.findOne({
      _id: sessions[0].userId,
    }, { projection: { password: 0, nonce: 0 } })

    if (!user) return res.status(401).send('Unauthorized')

    req.user = user
    req.token = token
    req.session = sessions[0]

    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await sessionsColl.deleteMany({ token })
      return res.status(400).send(error.name)
    }
    return res.status(401).send(error?.message)
  }
}

module.exports = auth
