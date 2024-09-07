import { createSlice } from "@reduxjs/toolkit"; // Importation de la fonction createSlice de Redux Toolkit

// Définition de l'état initial
const initialState = {
  value: [], // Tableau pour stocker les lieux
};

// Création du slice places avec Redux Toolkit
export const placesSlice = createSlice({
  name: "places", // Nom du slice

  initialState, // État initial
  reducers: {
    // Définition des reducers
    addPlace: (state, action) => {
      state.value.push(action.payload); // Ajoute un lieu au tableau
    },
    importPlaces: (state, action) => {
      state.value = []; // Réinitialise le tableau des lieux
      for (const element of action.payload) {
        state.value.push(element); // Ajoute chaque lieu importé au tableau
      }
    },
    updateLike: (state, action) => {
      console.log("en entrée ", action.payload);
      for (let i = 0; i < state.value.length; i++) {
        // Correction de l'initialisation de la boucle
        console.log(state.value[i].google_id);
        if (state.value[i].google_id === action.payload.id) {
          console.log("dans 1er if");
          if (
            state.value[i].likes.some(
              (element) => element === action.payload.pseudo
            )
          ) {
            console.log("dans 2iem if");
            state.value[i].likes = state.value[i].likes.filter(
              (element) => element !== action.payload.pseudo
            ); // Supprime le pseudo des likes
          } else {
            console.log("dans else");
            state.value[i].likes.push(action.payload.pseudo); // Ajoute le pseudo aux likes
          }
        }
      }
    },
    addComment: (state, action) => {
      const place = state.value.find(
        (place) => place.google_id === action.payload.google_id
      ); // Trouve le lieu correspondant
      if (place) {
        place.comments.push(action.payload.comment); // Ajoute le commentaire au lieu trouvé
      }
    },
  },
});

// Exportation des actions et du reducer
export const { addPlace, importPlaces, updateLike, addComment } =
  placesSlice.actions;
export default placesSlice.reducer;
