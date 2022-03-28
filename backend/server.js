// Inportation du package http de Node pour la création d'un serveur Node
const http = require('http');

// Importation de app.js
const app = require('./app');

// Configure le port
app.set('port', process.env.PORT || 3000);

// Création d'un serveur HTTP
const server = http.createServer(app);

// Ecoute du port (environnement PORT, ou 3000)
server.listen(process.env.PORT || 3000);