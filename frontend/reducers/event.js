import { createSlice } from "@reduxjs/toolkit"; // Importation de la fonction createSlice de Redux Toolkit

// Définition de l'état initial
const initialState = {
  value: {
    nom: "", // Nom de l'événement
    date: "", // Date de l'événement
    horaires: "", // Horaires de l'événement
    description: "", // Description de l'événement
  },
};

// Création du slice event avec Redux Toolkit
export const eventSlice = createSlice({
  name: "event", // Nom du slice

  initialState, // État initial
  reducers: {
    // Définition des reducers
    addEvent: (state, action) => {
      state.value.nom = action.payload.nom; // Mise à jour du nom de l'événement
      state.value.date = action.payload.date; // Mise à jour de la date de l'événement
      state.value.horaires = action.payload.horaires; // Mise à jour des horaires de l'événement
      state.value.description = action.payload.description; // Mise à jour de la description de l'événement
    },
  },
});

// Exportation des actions et du reducer
export const { addEvent } = eventSlice.actions;
export default eventSlice.reducer;
