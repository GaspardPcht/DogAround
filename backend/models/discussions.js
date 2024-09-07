const mongoose = require("mongoose");

// Définition du schéma pour les discussions
const discussionsSchema = mongoose.Schema({
  messages: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // ID de l'utilisateur qui a envoyé le message, référence à la collection 'users'
      date: Date, // Date d'envoi du message
      message: String, // Contenu du message
    },
  ],
  newMessage: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // ID de l'utilisateur qui a envoyé le dernier message
});

// Création du modèle Discussion basé sur le schéma défini
const Discussion = mongoose.model("discussions", discussionsSchema);

// Exportation du modèle Discussion pour l'utiliser dans d'autres parties de l'application
module.exports = Discussion;
