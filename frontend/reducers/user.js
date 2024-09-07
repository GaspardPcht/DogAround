import { createSlice } from "@reduxjs/toolkit"; // Importation de la fonction createSlice de Redux Toolkit

// Définition de l'état initial
const initialState = {
  value: {
    token: "", // Jeton d'authentification de l'utilisateur
    email: "", // Email de l'utilisateur
    avatar: "", // Avatar de l'utilisateur
    pseudo: "", // Pseudo de l'utilisateur
    city: "", // Ville de l'utilisateur
    cityfield: {
      cityname: "", // Nom de la ville
      latitude: 0.1, // Latitude de la ville
      longitude: 0.1, // Longitude de la ville
    },
    radius: 20000, // Rayon de recherche
    filtres: [], // Filtres appliqués
    favorites: [], // Favoris de l'utilisateur
    pastilleMessage: false, // Indicateur de message
  },
};

// Création du slice utilisateur avec Redux Toolkit
export const userSlice = createSlice({
  name: "user", // Nom du slice
  initialState, // État initial
  reducers: {
    // Définition des reducers
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.pseudo = action.payload.pseudo;
      state.value.city = action.payload.city;
      state.value.avatar = action.payload.avatar;
    },
    addToken: (state, action) => {
      state.value.token = action.payload;
    },
    storeFilters: (state, action) => {
      state.value.filtres = [];
      for (const element of action.payload) {
        state.value.filtres.push(element);
      }
    },
    storeCity: (state, action) => {
      state.value.cityfield.cityname = action.payload.cityname;
      state.value.cityfield.latitude = action.payload.latitude;
      state.value.cityfield.longitude = action.payload.longitude;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.pseudo = null;
      state.value.avatar = null;
    },
    addFavorite: (state, action) => {
      state.value.favorites.push(action.payload);
      console.log("favorites:", state.value.favorites);
    },
    removeFavorite: (state, action) => {
      state.value.favorites = state.value.favorites.filter(
        (x) => x !== action.payload
      );
    },
    setPastilleMessage: (state, action) => {
      state.value.pastilleMessage = action.payload;
    },
  },
});

// Exportation des actions et du reducer
export const {
  login,
  addToken,
  storeFilters,
  storeCity,
  logout,
  addFavorite,
  removeFavorite,
  setPastilleMessage,
} = userSlice.actions;
export default userSlice.reducer;
