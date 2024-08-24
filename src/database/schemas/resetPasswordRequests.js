const database = require('..');

const resetPasswordRequests = async () => {
  try {
    const { createCollection, runCommand, checkIfCollectionExists } = database;
    const resetPassColl = database.resetPasswordRequests();
    const collectionExists = await checkIfCollectionExists({
      collectionName: 'resetPasswordRequests',
    });
    if (!collectionExists) {
      await createCollection('resetPasswordRequests');
    }
    await runCommand({
      collMod: 'resetPasswordRequests',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'resetToken', 'username', 'createdAt'],
          properties: {
            userId: {
              bsonType: 'objectId',
            },
            resetToken: {
              bsonType: 'string',
            },
            email: {
              bsonType: 'string',
            },
            createdAt: {
              bsonType: 'date',
            },
          },
        },
      },
    });
    await resetPassColl.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 60 * 15 }
    ); // 15 minutes
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

module.exports = resetPasswordRequests;
