const mongoose = require("mongoose"); // Importation de la bibliothèque Mongoose

const connectionString = process.env.CONNECTION_STRING; // Récupération de la chaîne de connexion à partir des variables d'environnement

// Connexion à la base de données MongoDB avec Mongoose
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 }) // Définition du délai d'attente de connexion à 2000 ms
  .then(() => console.log("Data Connected")) // Affichage d'un message de succès si la connexion est établie
  .catch((error) => console.error("error")); // Affichage d'un message d'erreur en cas d'échec de la connexion
