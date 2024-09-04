import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: "",
    email: "",
    avatar: "",
    pseudo: "",
    city: "",
    cityfield: {
      cityname: "",
      latitude: 0.1,
      longitude: 0.1,
    },
    radius: 20000,
    filtres: [],
    favorites: [],
    pastilleMessage:false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
      state.value.favorites.push(action.payload)
      console.log('favorites:', state.value.favorites)
    },
    removeFavorite: (state, action) => {
      state.value.favorites = state.value.favorites.filter(x=> x !== action.payload)
    },
    setPastilleMessage: (state, action) => {
      state.value.pastilleMessage = action.payload;
    },
  },
});

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
