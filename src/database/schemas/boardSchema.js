const database = require('..');

const boardSchema = async () => {
  try {
    const { boards, createCollection, runCommand, checkIfCollectionExists } =
      database;
    const collectionExists = await checkIfCollectionExists({
      collectionName: 'boards',
    });
    if (!collectionExists) {
      await createCollection('boards');
    }
    await runCommand({
      collMod: 'boards',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['studentId', 'createdAt'],
          properties: {
            createdAt: {
              bsonType: 'date',
            },
            studentId: {
              bsonType: 'objectId',
            },
            pages: {
              bsonType: 'array',
            },
          },
        },
      },
    });

    const boardsColl = boards();
    await Promise.all([boardsColl.createIndex({ studentId: 1 })]);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

module.exports = boardSchema;
