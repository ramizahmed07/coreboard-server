const database = require('..');

const sessionsSchema = async () => {
  try {
    const { sessions, createCollection, runCommand } = database;
    const collectionExists = await database.checkIfCollectionExists({
      collectionName: 'sessions',
    });
    if (!collectionExists) {
      await createCollection('sessions');
    }
    await runCommand({
      collMod: 'sessions',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'token', 'createdAt', 'role'],
          properties: {
            userId: {
              bsonType: 'objectId',
            },
            token: {
              bsonType: 'string',
            },
            role: {
              bsonType: 'string',
            },
            createdAt: {
              bsonType: 'date',
            },
          },
        },
      },
    });

    const sessionsColl = sessions();
    // remove token after 1 day
    await Promise.all([
      sessionsColl.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 60 * 60 * 8 } // 8 hours
        // { expireAfterSeconds: 10 }, // 10 seconds for testing purposes only
      ),
      sessionsColl.createIndex({ userId: 1 }),
    ]);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

module.exports = sessionsSchema;
