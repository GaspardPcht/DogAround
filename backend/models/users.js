const mongoose = require("mongoose");

// Définition du schéma pour les utilisateurs
const usersSchema = mongoose.Schema({
  pseudo: String, // Pseudo de l'utilisateur
  avatar: String, // URL de l'avatar de l'utilisateur
  created_at: Date, // Date de création du compte
  private: Boolean, // Indique si le compte est privé
  email: String, // Adresse email de l'utilisateur
  password: String, // Mot de passe de l'utilisateur (à sécuriser)
  token: String, // Token d'authentification de l'utilisateur
  surname: String, // Nom de famille de l'utilisateur
  name: String, // Prénom de l'utilisateur
  city: String, // Ville de résidence de l'utilisateur
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "places" }], // Liste des lieux favoris de l'utilisateur
  companions: [
    {
      avatar: String, // URL de l'avatar du compagnon
      name: String, // Nom du compagnon
      dogBreed: String, // Race du chien
      weight: Number, // Poids du chien
      sex: Number, // Sexe du chien (0 pour femelle, 1 pour mâle)
      comment: String, // Commentaire sur le compagnon
    },
  ], // Liste des compagnons de l'utilisateur
  contacts: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // Référence à l'ID de l'utilisateur contacté
      discussion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "discussions",
      }, // Référence à l'ID de la discussion
      invitation: String, // Statut de l'invitation (issued, received, accepted, denied)
    },
  ], // Liste des contacts de l'utilisateur
  /* discussions: [{type: mongoose.Schema.Types.ObjectId, ref: 'discussions'}], // Liste des discussions de l'utilisateur (commenté) */
});

// Création du modèle User basé sur le schéma défini
const User = mongoose.model("users", usersSchema);

// Exportation du modèle User pour l'utiliser dans d'autres parties de l'application
module.exports = User;
