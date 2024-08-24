const { MongoClient, ObjectID } = require('mongodb');

let _db;

const database = {
  async connect() {
    try {
      const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      _db = client.db('core-board');
      console.log('Connected to database');
      return Promise.resolve();
    } catch (e) {
      console.log('Error connecting to database');
      console.error(e);
      return process.exit(1);
    }
  },
  db() {
    return _db;
  },
  createCollection(collection) {
    return _db.createCollection(collection);
  },
  runCommand(obj) {
    return _db.command(obj);
  },
  ObjectID() {
    return ObjectID;
  },
  users() {
    return _db.collection('users');
  },
  sessions() {
    return _db.collection('sessions');
  },
  boards() {
    return _db.collection('boards');
  },
  // topics() {
  //   return _db.collection('topics')
  // },
  // images() {
  //   return _db.collection('images')
  // },
  // workbooks() {
  //   return _db.collection('workbooks')
  // },
  resetPasswordRequests() {
    return _db.collection('resetPasswordRequests');
  },
  // categories() {
  //   return _db.collection('categories')
  // },
  async checkIfCollectionExists({ collectionName }) {
    // if we call this method using destructing this method in outer scope
    // then in schema we lose the reference to the class
    const collections = await _db.command({ listCollections: 1 });
    // batchSize defaults to 1000, we have approx 20 collections, so we're good
    if (collections?.cursor?.firstBatch?.length) {
      const { firstBatch } = collections.cursor;
      const matched = firstBatch.find((item) => item.name === collectionName);
      if (matched) return true;
    }
    return false;
  },
};

module.exports = database;
