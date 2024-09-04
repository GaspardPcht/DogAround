import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: []
};

export const placesSlice = createSlice({
    name: 'places',

    initialState,
    reducers: {
        addPlace: (state, action) => {
            state.value.push(action.payload);
        },
        importPlaces: (state, action) => {
            state.value = [];
            for (const element of action.payload) {
                state.value.push(element);
            }
        },
        updateLike: (state, action) =>{
            console.log('en entrée ',action.payload)
            for (let i; i<state.value.length;i++){
                console.log(state.value[i].google_id)
                if(state.value[i].google_id === action.payload.id){
                    console.log('dans 1er if')
                    if(state.value[i].likes.some((element) => element === action.payload.pseudo )){
                        console.log('dans 2iem if')
                        state.value[i].likes = state.value[i].likes.filter(element=>element !== action.payload.pseudo)
                    }else{
                        console.log('dans else')
                        state.value[i].likes.push(action.payload.pseudo)
                    }
                }
            }
        },
        addComment: (state, action) =>{
            state.value.comments.push(action.payload)
        }
    },
});

export const { addPlace, importPlaces,updateLike,addComment } = placesSlice.actions;
export default placesSlice.reducer;