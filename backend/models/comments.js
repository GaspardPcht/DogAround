// Définition du schéma pour les commentaires
const commentsSchema = mongoose.Schema({
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // ID de l'utilisateur qui a créé le commentaire, référence à la collection 'users'
  created_at: Date, // Date de création du commentaire
  title: String, // Titre du commentaire
  comment: String, // Contenu du commentaire
});

// Création du modèle Comment basé sur le schéma défini
const Comment = mongoose.model("comments", commentsSchema);

// Exportation du modèle Comment pour l'utiliser dans d'autres parties de l'application
module.exports = Comment;
