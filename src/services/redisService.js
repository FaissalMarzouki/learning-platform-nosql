// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :Définir des stratégies de cache appropriées
// Réponse :Utiliser des TTL (Time To Live) adaptés
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :Utiliser des préfixes cohérents
// Réponse :Inclure la version dans les clés

// Fonctions utilitaires pour Redis
const DEFAULT_TTL = 3600; // 1 hour in seconds

async function cacheData(key, data, ttl = DEFAULT_TTL) {
  try {
    const redisClient = require('../config/db').getRedisClient();
    const serializedData = JSON.stringify(data);
    await redisClient.setEx(key, ttl, serializedData);
  } catch (error) {
    console.error('Error in cacheData:', error);
    throw error;
  }
}

async function getCachedData(key) {
  try {
    const redisClient = require('../config/db').getRedisClient();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error in getCachedData:', error);
    throw error;
  }
}

async function invalidateCache(key) {
  try {
    const redisClient = require('../config/db').getRedisClient();
    await redisClient.del(key);
  } catch (error) {
    console.error('Error in invalidateCache:', error);
    throw error;
  }
}

module.exports = {
  cacheData,
  getCachedData,
  invalidateCache
};