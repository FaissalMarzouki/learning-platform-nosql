// Question: Pourquoi créer des services séparés ?
// Réponse: Abstraction des détails d'implémentation

const { ObjectId } = require('mongodb');

async function findOneById(collection, id) {
  try {
    const objectId = new ObjectId(id);
    return await collection.findOne({ _id: objectId });
  } catch (error) {
    console.error('Error in findOneById:', error);
    throw error;
  }
}

async function insertOne(collection, data) {
  try {
    return await collection.insertOne(data);
  } catch (error) {
    console.error('Error in insertOne:', error);
    throw error;
  }
}

async function find(collection, query, options = {}) {
  try {
    return await collection.find(query, options).toArray();
  } catch (error) {
    console.error('Error in find:', error);
    throw error;
  }
}

module.exports = {
  findOneById,
  insertOne,
  find
};