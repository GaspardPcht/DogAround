const mongoose = require("mongoose");

// Définition du schéma pour les lieux
const placesSchema = mongoose.Schema({
  title: String, // Titre du lieu
  description: String, // Description du lieu
  hours: [], // Horaires d'ouverture du lieu
  categorie: String, // Catégorie du lieu
  created_at: Date, // Date de création du lieu
  created_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // Référence à l'utilisateur qui a créé le lieu
  location: { latitude: String, longitude: String }, // Coordonnées géographiques du lieu
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // Liste des utilisateurs qui ont aimé le lieu
  /* nbLike: Number, // Nombre de likes (commenté) */
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }], // Liste des événements associés au lieu
  google_id: String, // ID Google du lieu
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }], // Liste des commentaires sur le lieu
  image: String, // URL de l'image du lieu
});

// Création du modèle Place basé sur le schéma défini
const Place = mongoose.model("places", placesSchema);

// Exportation du modèle Place pour l'utiliser dans d'autres parties de l'application
module.exports = Place;
