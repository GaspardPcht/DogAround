const express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

const User = require("../models/users");
const Place = require("../models/places");

// Déclaration des catégories à récupérer sur Google Maps
const placesTypes = [
  "park",
  "dog_park",
  "pet_store",
  "restaurant",
  "national_park",
  "veterinary_care",
];

// Déclaration des catégories côté frontend
const categories = [
  ["park", "parc"],
  ["dog_park", "parc"],
  ["national_park", "parc"],
  ["pet_store", "animalerie"],
  ["restaurant", "restaurant"],
  ["veterinary_care", "veterinaire"],
  ["", "air"],
  ["", "eau"],
  ["", "like"],
  ["", "utilisateur"],
  ["", "event"],
];

// Route GET pour récupérer les points d'intérêts et événements autour de l'utilisateur
router.get("/position/:latitude/:longitude/:radius", (req, res) => {
  // Vérification des paramètres de la route
  if (
    req.params.latitude === null ||
    req.params.longitude === null ||
    req.params.radius === null
  ) {
    res
      .status(400)
      .json({
        result: false,
        error: "problem route get places/position/:latitude/:longitude/:radius",
      });
    return;
  }

  // Écriture de la query includedTypes
  let dataTypes = "";
  for (const element of placesTypes) {
    dataTypes += `&includedTypes=${element}`;
  }

  // Écriture globale de la query en fonction de la latitude, longitude, rayon autour de l'utilisateur, et des catégories des places voulues
  const params = `locationRestriction.circle.center.latitude=${req.params.latitude}&locationRestriction.circle.center.longitude=${req.params.longitude}&locationRestriction.circle.radius=${req.params.radius}${dataTypes}`;

  // Requête API Google
  fetch(`https://places.googleapis.com/v1/places:searchNearby?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.location,places.allowsDogs,places.types",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Mise en forme des données à renvoyer au frontend
      if (data) {
        const places = data.places.map((e) => {
          // Conversion du type Google en type utilisable côté frontend
          let typefilter = "";
          for (const googletype of e.types) {
            for (const element of categories) {
              if (googletype.toLowerCase() === element[0].toLowerCase()) {
                typefilter = element[1].toLowerCase();
                break;
              }
            }
          }
          if (typefilter.length === 0) {
            typefilter = "autre";
          }

          // Schéma objet nouvelle place à renvoyer au frontend
          const newPlace = {
            id: "",
            google_id: e.id,
            location: e.location,
            type: typefilter,
            events: [],
            likes: [],
            comments: [],
          };

          return newPlace;
        });

        // Réponse route
        res.status(200).json({ result: true, places });
      } else {
        // Réponse route
        res.status(200).json({ result: true, message: "Pas de résultat" });
      }
    });
});

// Route GET pour récupérer les informations de l'API Google sur le lieu dont on a récupéré le google_id
router.get("/id/:google_id", (req, res) => {
  const google_id = req.params.google_id;
  fetch(
    `https://places.googleapis.com/v1/places/${google_id}?languageCode=fr`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "displayName,photos,location,regularOpeningHours,formattedAddress,primaryType,editorialSummary",
      },
    }
  )
    .then((response) => response.json())
    .then((placeData) => {
      console.log("Place Data : " + placeData);
      const imageURL = placeData?.photos[0]?.name;
      const splitImageURL = imageURL.split("/");
      const newImageUrl = splitImageURL[3];

      res.json({
        result: true,
        place: {
          _id: req.params.id,
          image:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
              newImageUrl +
              "&key=" +
              process.env.GOOGLE_API_KEY || "non disponible",
          nom: placeData?.displayName?.text || "non disponible",
          adresse: placeData?.formattedAddress || "non disponible",
          horaires:
            placeData?.regularOpeningHours?.weekdayDescriptions ||
            "non disponible",
          categorie: placeData?.primaryType || "non disponible",
          description: placeData?.editorialSummary?.text || "non disponible",
          location: {
            latitude: placeData?.location?.latitude || "non disponible",
            longitude: placeData?.location?.longitude || "non disponible",
          },
        },
      });
    });
});

// Route POST pour enregistrer un nouveau POI dans la BDD par l'utilisateur
router.post("/new/:google_id/:location", (req, res) => {
  Place.findOne({
    google_id: req.params.google_id,
    location: req.params.location,
    categorie: req.body.categorie,
  }).then((data) => {
    const google_id = req.params.google_id;
    const title = req.body.title;
    const location = req.params.location;
    const categorie = req.body.categorie;

    if (!google_id || !title || !location || !categorie) {
      res.json({ result: false, message: "Fill the Fields" });
      return;
    }

    if (data) {
      res.json({ result: false, message: "POI already exists" });
      return;
    }

    if (!data) {
      const newPlace = new Place({
        title: req.body.title,
        description: req.body.description,
        hours: req.body.hours,
        categorie: "Autre",
        created_at: new Date(),
        location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
        google_id: req.params.google_id,
        image: req.body.image,
      });
      newPlace.save().then((newData) => {
        res.json({
          result: true,
          title: newData.title,
          description: newData.description,
          hours: newData.hours,
          categorie: newData.categorie,
          created_at: newData.created_at,
          location: newData.location,
          google_id: newData.google_id,
          image: newData.image,
        });
      });
    }
  });
});

// Route PUT pour voir si l'_id du User est dans la BDD du Like du Place
// puis rajouter ou supprimer l'_id en fonction de sa présence dans le Like
router.put("/like/:id", (req, res) => {
  // Recherche du lieu par ID
  Place.findById(req.params.id).then((place) => {
    if (!place) {
      res.json({ result: false, error: "Place not found" });
      return;
    }

    // Recherche de l'utilisateur par token
    User.findOne({ token: req.body.token }).then((user) => {
      if (user === null) {
        res.json({ result: false, error: "User not found" });
        return;
      }

      // Si l'_id du User est présent dans les Likes du Place, supprimer l'_id
      if (place.likes.includes(user._id)) {
        Place.updateOne({ _id: req.params.id }, { $pull: { likes: user._id } }) // Remove user ID from likes
          .then((data) => {
            res.json({ result: true, message: "Like Removed", user: data });
          });

        // Sinon ajouter l'_id dans le Like car non présent
      } else {
        Place.updateOne(
          { _id: req.params.id },
          { $push: { likes: user._id } }
        ).then((data) => {
          res.json({ result: true, message: "Like Added", user: data });
        });
      }
    });
  });
});

module.exports = router;
