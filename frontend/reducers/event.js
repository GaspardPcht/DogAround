import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nom: "",
    date: "",
    horaires: "",
    description: "",
  },
};

export const eventSlice = createSlice({
  name: "event",

  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.value.nom = action.payload.nom;
      state.value.date = action.payload.date;
      state.value.horaires = action.payload.horaires;
      state.value.description = action.payload.description;
    },
  },
});

export const { addEvent } = eventSlice.actions;
export default eventSlice.reducer;
