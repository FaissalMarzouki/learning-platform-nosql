// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Organisation logique par domaine
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Grouper par fonctionnalité/ressource

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.get('/stats', courseController.getCourseStats);

module.exports = router;