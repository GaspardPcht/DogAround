var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Place = require("../models/places");
const Discussion = require("../models/discussions");

const uid2 = require("uid2"); // Bibliothèque pour générer des identifiants uniques
const bcrypt = require("bcrypt"); // Bibliothèque pour le hachage des mots de passe

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Route pour l'inscription (SignUp)
router.post("/signup", (req, res) => {
  // Recherche d'un utilisateur existant avec le même pseudo ou email
  User.findOne({
    $or: [{ pseudo: req.body.pseudo }, { email: req.body.email }],
  }).then((usersData) => {
    const pseudo = req.body.pseudo;
    const token = uid2(32); // Génération d'un token unique
    const hash = bcrypt.hashSync(req.body.password, 10); // Hachage du mot de passe avec bcrypt
    const email = req.body.email;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi; // RegEx pour valider l'adresse email
    const surname = req.body.surname;
    const name = req.body.name;
    const city = req.body.city;
    const avatar = req.body.avatar;

    // Vérification des champs vides
    if (!pseudo || !req.body.password || !email) {
      res.json({ result: false, error: "fill the fields" });
      return;
    }

    // Vérification de la validité de l'adresse email
    if (!emailRegex.test(email)) {
      res.json({ result: false, error: "invalid email address" });
      return;
    }

    // Vérification si le compte existe déjà
    if (usersData) {
      res.json({ result: false, error: "username or email already used" });
      return;
    }

    // Création d'un nouvel utilisateur dans la base de données
    if (usersData === null) {
      const newUser = new User({
        pseudo: pseudo,
        avatar: avatar,
        created_at: new Date(),
        private: false,
        email: email,
        password: hash,
        token: token,
        surname: surname,
        name: name,
        city: city,
      });
      newUser.save().then((data) => {
        res.json({
          result: true,
          pseudo: data.pseudo,
          city: data.city,
          token: data.token,
          avatar: data.avatar,
        });
      });
    }
  });
});

// Route pour récupérer les informations de l'utilisateur
router.get("/signin", (req, res) => {
  // Recherche d'un utilisateur par token
  User.findOne({ token: req.query.token }).then((userData) => { // Correction: utilisation de req.query.token
    if (userData) {
      res.json({ result: true, user: userData });
    } else {
      res.json({ result: false, message: "user not found" });
    }
  });
});

// Route pour la connexion de l'utilisateur
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Vérifier que les champs ne sont pas vides
  if (!email || !password) {
    return res.json({ result: false, error: "fill the fields" });
  }

  // Chercher l'utilisateur par email
  User.findOne({ email }).then((userData) => {
    if (userData && bcrypt.compareSync(password, userData.password)) {
      const token = uid2(32); // Génération d'un nouveau token
      userData.token = token;
      userData.save().then(() => {
        res.json({
          result: true,
          token: userData.token,
          pseudo: userData.pseudo,
          city: userData.city,
          avatar: userData.avatar,
        });
      });
    } else {
      res.json({ result: false, error: "wrong email or password" });
    }
  });
});


//route pour mettre à jour le token
router.put("/:token", (req, res) => {
  const update = {};

  // Vérifier chaque champ modifiable et l'ajouter à update seulement s'il est fourni
  if (req.body.pseudo) update.pseudo = req.body.pseudo;
  if (req.body.email) update.email = req.body.email;
  if (req.body.surname) update.surname = req.body.surname;
  if (req.body.name) update.name = req.body.name;
  if (req.body.city) update.city = req.body.city;
  if (req.body.avatar) update.avatar = req.body.avatar;

  // Hachage du mot de passe si un nouveau mot de passe est fourni
  if (req.body.password) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    update.password = hash;
  }

  // Mise à jour de l'utilisateur avec les champs modifiés
  User.findOneAndUpdate(
    { token: req.params.token },
    { $set: update },
    { new: true }
  ).then((data) => {
    if (data) {
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, message: "Utilisateur non trouvé" });
    }
  });
});

//route delete /user/companions/delete => suppression d'un compagnon
router.delete("/companions/delete", (req, res) => {
  //Déclaration nouveau compagnon
  const companion = {
    name: req.body.name,
  };

  //Message d'erreur
  if (!companion.name) {
    return res.json({ result: false, error: "champs compagnon vide" });
  }

  //Mise à jour compagnon
  User.findOneAndUpdate(
    { token: req.body.token, "companions.name": companion.name },
    { $pull: { companions: companion } }
  ).then((data) => {
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

// Route pour ajouter ou mettre à jour un compagnon
router.post("/companions/update", (req, res) => {
  // Déclaration du nouveau compagnon
  const newCompanion = {
    avatar: req.body.avatar,
    name: req.body.name,
    dogBreed: req.body.dogBreed,
    weight: Number(req.body.weight),
    sex: req.body.sex,
    comment: req.body.comment,
  };

  // Message d'erreur si le nom du compagnon n'est pas fourni
  if (!newCompanion.name) {
    return res.json({
      result: false,
      error: "Veuillez entrer au moins le nom de votre compagnon!",
    });
  }

  // Mise à jour du compagnon s'il existe déjà
  User.findOneAndUpdate(
    { token: req.body.token, "companions.name": newCompanion.name },
    { $set: { "companions.$": newCompanion } }
  ).then((data) => {
    console.log(data);
    if (data) {
      res.json({ result: true });
      return;
    } else {
      // Ajout du compagnon s'il n'existe pas
      User.findOneAndUpdate(
        { token: req.body.token },
        { $push: { companions: newCompanion } }
      ).then((data) => {
        if (data) {
          res.json({ result: true });
        } else {
          res.json({ result: false, error: "Utilisateur non trouvé" });
        }
      });
    }
  });
});

// Route pour récupérer les informations des compagnons
router.post("/companions", (req, res) => {
  // Récupération de la liste des compagnons
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      const companions = data.companions.map((e) => {
        return {
          avatar: e.avatar,
          name: e.name,
          dogBreed: e.dogBreed,
          weight: e.weight,
          sex: e.sex,
          comment: e.comment,
        };
      });
      res.json({ result: true, companions });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

// Route pour récupérer les informations d'un favori par ID
router.get("/favori/:id/", (req, res) => {
  Place.findOne({ token: req.params.id }).then((dataPlace) => {
    console.log(dataPlace);
    if (!dataPlace) {
      User.findOne({ token: req.body.token }).then((userData) => {
        console.log(userData);
        res.json({ result: true, user: userData });
      });
    }
  });
});

// Route pour récupérer les informations de l'utilisateur par token
router.get("/favori", (req, res) => {
  User.findOne({ token: req.body.token }).then((userData) => {
    res.json({ result: true, users: userData });
    console.log(userData);
  });
});

// Route pour ajouter ou supprimer un favori
router.put("/favori/:id", (req, res) => {
  // Recherche de l'utilisateur par token
  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    // Recherche du lieu par ID
    Place.findById(req.params.id).then((place) => {
      if (!place) {
        res.json({ result: false, error: "Place not found" });
        return;
      }

      // Si l'ID du lieu est présent dans les favoris de l'utilisateur, le supprimer
      if (user.favorites.includes(req.params.id)) {
        User.updateOne(
          { token: req.body.token },
          { $pull: { favorites: req.params.id } }
        ).then((data) => {
          res.json({ result: true, message: "Favorit Removed", user: data });
        });

      // Sinon, ajouter l'ID du lieu aux favoris
      } else {
        User.updateOne(
          { token: req.body.token },
          { $push: { favorites: req.params.id } }
        ).then((data) => {
          res.json({ result: true, message: "Favorit Added", user: data });
        });
      }
    });
  });
});

// Route pour rechercher des pseudos par rapport à un caractère donné
router.get("/:token/pseudos", (req, res) => {
  const token = req.params.token;
  const searchQuery = req.query.search || "";

  // Vérifie si le token est valide
  User.findOne({ token: token })
    .then((validUser) => {
      if (!validUser) {
        return res.json({ result: false, message: "User not found" });
      }

      // Crée une expression régulière pour les pseudos commençant par searchQuery
      const regex = new RegExp(`^${searchQuery}`, "i");

      // Récupère les pseudos correspondant au caractère dans la recherche
      return User.find({ pseudo: { $regex: regex } }).select("pseudo");
    })
    .then((allPseudos) => {
      if (allPseudos.length > 0) {
        const pseudos = allPseudos.map((user) => user.pseudo);
        res.json({ result: true, pseudos });
      } else {
        res.json({ result: false, pseudos: [] });
      }
    });
});


// Route pour demander une invitation à une discussion
router.post("/invitation/:token", async (req, res) => {
  // Vérification utilisateur connecté
  const validUser = await User.findOne({ token: req.params.token });
  if (!validUser) {
    return res.json({ result: false, error: "Utilisateur non connecté" });
  }

  // Définition du contact receveur
  const contact_recipient = {
    user_id: validUser.id, // Stockage user_id
    invitation: "received",
  };

  // Recherche et mise à jour de l'utilisateur à inviter en fonction du pseudo unique
  const userData = await User.findOneAndUpdate(
    { pseudo: req.body.pseudo },
    { $push: { contacts: contact_recipient } }
  );

  if (!userData) {
    return res.json({
      result: false,
      error: "Pseudo utilisateur à inviter non trouvé",
    });
  }

  // Mise à jour du contact émetteur
  const contact_issuer = {
    user_id: userData.id, // Stockage user_id
    invitation: "issued",
  };

  const userData2 = await User.findOneAndUpdate(
    { token: req.params.token },
    { $push: { contacts: contact_issuer } }
  );

  if (!userData2) {
    return res.json({ result: false, error: "Utilisateur non connecté" });
  }

  // Réponse route
  res.json({ result: true });
});

// Route pour récupérer les contacts via le token de l'utilisateur
router.get("/contacts/:token", (req, res) => {
  const token = req.params.token;

  // Vérifie si le token est valide
  User.findOne({ token: token })
    .populate("contacts.user_id", "pseudo avatar")
    .populate({
      path: "contacts.discussion_id",
      populate: { path: "newMessage", select: "pseudo" },
    })
    .populate("contacts.user_id", ["pseudo", "avatar", "-_id"])
    .then((validUser) => {
      if (!validUser) {
        return res.json({ result: false, message: "User not found" });
      }

      if (validUser.contacts.length > 0) {
        const contacts = validUser.contacts.map((e) => {
          const obj = {
            pseudo: e.user_id.pseudo,
            avatar: e.user_id.avatar,
            invitation: e.invitation,
            discussion: e.discussion_id,
          };
          return obj;
        });
        res.json({ result: true, contacts });
        return;
      }

      res.json({ result: true, contacts: [] });
    });
});

// Route pour répondre à une invitation à une discussion
router.put("/invitation/:token", async (req, res) => {
  // Vérification utilisateur connecté
  const validUser = await User.findOne({ token: req.params.token });
  if (!validUser) {
    return res.json({ result: false, error: "Utilisateur non trouvé" });
  }

  // Recherche de l'utilisateur receveur de l'invitation
  const user_id_recipient = validUser.id;
  const answer = req.body.answer;

  // Si invitation acceptée alors création discussion
  let dataDiscussion = "";
  if (answer === "accepted") {
    const newDiscussion = new Discussion();

    dataDiscussion = await newDiscussion.save();
    if (!dataDiscussion) {
      return res.json({
        result: false,
        error: "Problème de sauvegarde de la discussion",
      });
    }
  }

  // Mise à jour du contact émetteur de l'invitation
  const userData = await User.findOneAndUpdate(
    { pseudo: req.body.pseudo, "contacts.user_id": user_id_recipient },
    {
      $set: {
        "contacts.$.invitation": answer,
        "contacts.$.discussion_id": dataDiscussion.id,
      },
    }
  ); // answer = "accepted" ou "denied"

  if (!userData) {
    return res.json({ result: false, error: "Pseudo utilisateur non trouvé" });
  }

  // Mise à jour du contact invité
  const user_id_issuer = userData.id;
  const userData2 = await User.findOneAndUpdate(
    { token: req.params.token, "contacts.user_id": user_id_issuer },
    {
      $set: {
        "contacts.$.invitation": answer,
        "contacts.$.discussion_id": dataDiscussion.id,
      },
    }
  ); // answer = "accepted" ou "denied"
  if (!userData2) {
    return res.json({ result: false, error: "Utilisateur non trouvé" });
  }

  // Réponse route
  res.json({ result: true });
});

module.exports = router;