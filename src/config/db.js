// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Gestion centralisée : Plus facile de gérer les erreurs et la configuration à un seul endroit
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : Attendre la fin des opérations en cours avant la fermeture


const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true
    });

    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function connectRedis() {
  try {
    redisClient = redis.createClient({
      url: config.redis.uri
    });

    await redisClient.connect();
    console.log('Redis connected successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    // Retry logic could be implemented here
    throw error;
  }
}

async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
    throw error;
  }
}

module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getDb: () => db,
  getRedisClient: () => redisClient
};
