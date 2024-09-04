import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Platform, Dimensions } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import Btn from "../Components/Button";

import { useDispatch } from 'react-redux';
import { storeFilters, storeCity } from '../reducers/user'

export default function Filter({ userInfo, validFilters }) {
  const dispatch = useDispatch();
  const [city, setCity] = useState(userInfo.cityfield.cityname); //Etat champ Ville
  const [suggestionsList, setSuggestionsList] = useState([{ id: '1', title: userInfo.cityfield.cityname }]);
  const [filters, setFilters] = useState(userInfo.filtres); //Etat filtres sélectionnés
  const [optionCity, setOptionCity] = useState(userInfo.cityfield.cityname); //Sélection Ma position/Ville

  //Fonction sélection filtres
  const selectFilter = (filter) => {
    const newDataFilters = filters.filter(e => e !== filter);

    if (newDataFilters.length < filters.length) {
      //Retire le filtre
      setFilters(newDataFilters);
    }
    else {
      //Ajout nouveau filtre
      setFilters([...filters, filter]);
    }
  }

  //Raz ville
  const onClearPress = () => {
    setSuggestionsList([]);
  }

  //Recherche ville
  const getSuggestions = (query) => {
    // Prevent search with an empty query
    if (query === '') {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&type=municipality&autocomplete=0`)
      .then((response) => response.json())
      .then(data => {
        if (data.features.length > 0) {
          const suggestions = data.features.map((data, i) => {
            return { id: (i + 1), title: data.properties.name };
          });
          setSuggestionsList(suggestions);
        }
        else {
          setSuggestionsList([]);
        }
      });

  };

  //Confirmation filtres
  const confirmation = () => {
    dispatch(storeFilters(filters));
    //Positionnement des markers par rapport à la ville
    if (optionCity) {
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          const newCity = {
            cityname: data.features[0].properties.city,
            latitude: data.features[0].geometry.coordinates[1],
            longitude: data.features[0].geometry.coordinates[0],
          };
          dispatch(storeCity(newCity));
        })
    }
    //Positionnement des markers par rapport à la position
    else {
      dispatch(storeCity({
        cityname: '',
        latitude: 0.1,
        longitude: 0.1,
      }));
    }
    validFilters();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtres</Text>
      <View style={styles.selection}>
        {/* <TextInput
          style={styles.cityInput}
          placeholder="Ville"
          accessibilityLabel="City Input"
          value={city}
          onChangeText={setCity}
          editable={optionCity}
        /> */}
        <AutocompleteDropdown
          emptyResultText="Aucun résultat"
          initialValue={{ id: '1' }}
          debounce={500}
          onChangeText={(value) => getSuggestions(value)}
          onSelectItem={(item) => item && setCity(item.title)}
          dataSet={suggestionsList}
          textInputProps={{
            placeholder: 'Ville',
            style: {
              width: Dimensions.get('window').width * 0.5,
            },
          }}
          direction={Platform.select({ ios: 'down' })}
          inputContainerStyle={styles.inputContainer}
          containerStyle={styles.dropdownContainer}
          suggestionsListContainerStyle={styles.suggestionListContainer}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          /* editable={optionCity} */
          clearOnFocus={false}
          closeOnSubmit={true}
          onClear={() => onClearPress()}
        />
        <TouchableOpacity style={styles.button} onPress={() => setOptionCity(!optionCity)}>
          {!optionCity && <Text style={styles.buttontext}>Ma Position</Text>}
          {optionCity && <Text style={styles.buttontext}>Ville</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.containerfilters}>
        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'parc')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('parc')}
          />
          <Text style={styles.text}>Parcs et forêts</Text>

        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'air')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('air')}
          />
          <Text style={styles.text}>Air canine</Text>

        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'veterinaire')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('veterinaire')}
          />
          <Text style={styles.text}>Veterinaire</Text>

        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'animalerie')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('animalerie')}
          />
          <Text style={styles.text}>Animalerie</Text>

        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'eau')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('eau')}
          />
          <Text style={styles.text}>Point d'eau</Text>
        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'restaurant')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('restaurant')}
          />
          <Text style={styles.text}>Bar/Restaurant</Text>
        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'favori')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('favori')}
          />
          <Text style={styles.text}>Favoris</Text>
        </View>

        <View style={styles.row}>
          <FontAwesome name='paw'
            size={40}
            style={{ marginRight: 15, color: (filters.some(e => e === 'autre')) ? '#D9D9D9' : '#416165' }}
            onPress={() => selectFilter('autre')}
          />
          <Text style={styles.text}>Autres</Text>
        </View>
      </View>
      <Btn title="Confirmer" onPress={() => confirmation()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    padding: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '90%',
    borderRadius: 20,
  },

  containerfilters: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '100%',
  },

  selection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  title: {
    fontFamily: "Poppins_600Regular",
    fontSize: 20,
    color: '#416165',
    padding: 10,
  },

  text: {
    fontFamily: "Poppins_600Regular",
    fontSize: 20,
    color: '#416165'
  },

  button: {
    backgroundColor: '#BB7E5D',
    padding: 11,
    width: '50%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttontext: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },

  cityInput: {
    width: '50%',
    borderWidth: 1,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  dropdownContainer: {
    width: '50%',
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginRight: 10,
  },

  inputContainer: {
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },

  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '200%',
  },

  // text:{
  //   color: '#416165'
  // }
})
