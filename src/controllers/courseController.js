// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Route : Définit l'URL et la méthode HTTP , Contrôleur : Contient la logique métier
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :Réutilisabilité de la logique métier

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const courseData = req.body;
    const database = db.getDb();
    const collection = database.collection('courses');
    
    const result = await mongoService.insertOne(collection, courseData);
    await redisService.invalidateCache('courses_list');
    
    res.status(201).json({
      success: true,
      data: { ...courseData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create course'
    });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;
    const cacheKey = `course_${id}`;
    
    const cachedData = await redisService.getCachedData(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        source: 'cache'
      });
    }
    
    const database = db.getDb();
    const collection = database.collection('courses');
    const course = await mongoService.findOneById(collection, id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    await redisService.cacheData(cacheKey, course);
    
    res.json({
      success: true,
      data: course,
      source: 'database'
    });
  } catch (error) {
    console.error('Error in getCourse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve course'
    });
  }
}

async function getCourseStats(req, res) {
  try {
    const database = db.getDb();
    const collection = database.collection('courses');
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          averageStudents: { $avg: { $size: "$students" } }
        }
      }
    ]).toArray();
    
    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error in getCourseStats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve course statistics'
    });
  }
}

module.exports = {
  createCourse,
  getCourse,
  getCourseStats
};
