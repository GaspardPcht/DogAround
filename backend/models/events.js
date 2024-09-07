const mongoose = require("mongoose");

// Définition du schéma pour les événements
const eventsSchema = mongoose.Schema({
  created_by: id_, // ID de l'utilisateur qui a créé l'événement (à corriger, devrait être { type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  created_at: Date, // Date de création de l'événement
  title: String, // Titre de l'événement
  description: String, // Description de l'événement
  dates: [Date], // Liste des dates de l'événement
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }], // Liste des commentaires associés à l'événement
});

// Création du modèle Event basé sur le schéma défini
const Event = mongoose.model("events", eventsSchema);

// Exportation du modèle Event pour l'utiliser dans d'autres parties de l'application
module.exports = Event;
