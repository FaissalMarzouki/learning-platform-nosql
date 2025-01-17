// Question: Comment organiser le point d'entrée de l'application ?
// Réponse :Importer les dépendances nécessaires en premier (express, config, etc.)
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse : Utiliser async/await pour la séquence de démarrage, attendre que toutes les connexions soient établies .
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');

const app = express();

async function startServer() {
  try {
    await db.connectMongo();
    await db.connectRedis();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/courses', courseRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        error: 'Something went wrong!'
      });
    });

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  try {
    await db.closeConnections();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();

module.exports = app;