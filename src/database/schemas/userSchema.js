const database = require('..');

const userSchema = async () => {
  try {
    const { users, createCollection, runCommand, checkIfCollectionExists } =
      database;
    const collectionExists = await checkIfCollectionExists({
      collectionName: 'users',
    });
    if (!collectionExists) {
      await createCollection('users');
    }
    await runCommand({
      collMod: 'users',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['createdAt', 'username', 'role', 'password', 'voice'],
          properties: {
            createdAt: {
              bsonType: 'date',
            },
            username: {
              bsonType: 'string',
            },
            role: {
              bsonType: 'string',
            },
            password: {
              bsonType: 'string',
              minLength: 1,
            },
            voice: {
              bsonType: 'object',
              properties: {
                lang: {
                  bsonType: 'string',
                },
                name: {
                  bsonType: 'string',
                },
              },
            },
          },
        },
      },
    });

    const usersColl = users();
    await Promise.all([
      usersColl.createIndex({ username: 1 }, { unique: true }),
    ]);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(new Error(e));
  }
};

module.exports = userSchema;
