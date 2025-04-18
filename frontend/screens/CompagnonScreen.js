import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView
} from "react-native";

import ModalAvatar from "../Components/ModalAvatar";
import Btn from "../Components/Button";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Dropdown } from 'react-native-element-dropdown';

export default function CompagnonScreen({ navigation, route }) {
  // Hook pour vérifier si l'écran est focalisé
  const isFocused = useIsFocused();

  // Sélection de l'état de l'utilisateur dans le store Redux
  const user = useSelector((state) => state.user.value);

  // États locaux pour gérer les informations du compagnon
  const [name, setName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // État pour gérer la visibilité de la modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // État pour gérer l'avatar sélectionné
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Données pour le sexe du compagnon
  const datasex = [
    { label: "Male", value: "1" },
    { label: "Femelle", value: "2" },
  ];

  // Récupération des paramètres de la route pour l'édition du compagnon
  const editCompagnon = route.params.compagnon;

  // Fonction pour fermer l'écran et naviguer vers l'onglet "Compte"
  const handleClickCloseScreen = () => {
    navigation.navigate("TabNavigator", { screen: "Compte" });
  };

  // Fonction pour ouvrir la modal
  const handleClickOpenModal = () => {
    setIsModalVisible(true);
  };

  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Fonction pour sélectionner un avatar
  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar.source);
  };
  // Fonction pour valider et mettre à jour les informations du compagnon
  const handleValidation = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/companions/update`,
      {
        method: "POST", // Méthode HTTP utilisée pour la requête
        headers: { "Content-Type": "application/json" }, // En-tête pour indiquer le type de contenu
        body: JSON.stringify({
          token: user.token, // Token de l'utilisateur pour l'authentification
          avatar: selectedAvatar, // Avatar sélectionné
          name: name, // Nom du compagnon
          weight: weight, // Poids du compagnon
          dogBreed: dogBreed, // Race du chien
          sex: sex, // Sexe du compagnon
          comment: comment, // Commentaire
        }),
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          // Si la mise à jour a réussi, navigue vers l'écran "Compte"
          navigation.navigate("TabNavigator", { screen: "Compte" });
        } else {
          // Sinon, affiche le message d'erreur
          setErrorMessage(data.error);
        }
      });
  };

  // Fonction pour supprimer un compagnon
  const handleDelete = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/companions/delete`,
      {
        method: "DELETE", // Méthode HTTP utilisée pour la requête
        headers: { "Content-Type": "application/json" }, // En-tête pour indiquer le type de contenu
        body: JSON.stringify({
          token: user.token, // Token de l'utilisateur pour l'authentification
          name: name, // Nom du compagnon à supprimer
        }),
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          // Si la suppression a réussi, navigue vers l'écran "Compte"
          navigation.navigate("TabNavigator", { screen: "Compte" });
        } else {
          // Sinon, affiche le message d'erreur
          setErrorMessage(data.error);
        }
      });
  };

  useEffect(() => {
    // Récupération des données du compagnon
    if (isFocused) {
      if (editCompagnon) {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/companions`, {
          method: "POST", // Méthode HTTP utilisée pour la requête
          headers: {
            "Content-Type": "application/json", // En-tête pour indiquer le type de contenu
          },
          body: JSON.stringify({
            token: user.token, // Token de l'utilisateur pour l'authentification
          }),
        })
          .then((response) => response.json()) // Convertit la réponse en JSON
          .then((data) => {
            // Filtre pour trouver le compagnon à éditer
            const datacompanion = data.companions.filter(
              (e) => e.name === editCompagnon
            )[0];
            /* console.log(data) */
            if (data.result) {
              // Mise à jour des états avec les données du compagnon
              setName(datacompanion.name);
              setDogBreed(datacompanion.dogBreed);
              setWeight(datacompanion.weight);
              setSex(datacompanion.sex);
              setComment(datacompanion.comment);
              setSelectedAvatar(datacompanion.avatar);
            }
          });
      } else {
        // Réinitialisation des états si aucun compagnon n'est à éditer
        setName("");
        setDogBreed("");
        setWeight("");
        setSex("");
        setComment("");
        setSelectedAvatar(require("../assets/avatars/chien_1.png"));
      }
    }
  }, [isFocused]); // Dépendance sur isFocused pour exécuter l'effet lorsque l'écran est focalisé

  // Création d'une référence pour un élément de défilement
  const scroll = useRef();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          ref={scroll}
          onContentSizeChange={() => {
            scroll.current.scrollToEnd();
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClickCloseScreen}>
              <FontAwesome name="times" size={25} color="#000" />
            </TouchableOpacity>
          </View>
          {editCompagnon && <Text style={styles.title}>{name}</Text>}
          {!editCompagnon && (
            <TextInput
              style={styles.titleInput}
              placeholder="Editer Nom"
              value={name}
              onChangeText={(value) => setName(value)}
            ></TextInput>
          )}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  selectedAvatar || require("../assets/avatars/chien_1.png")
                }
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity
              style={styles.plusIcon}
              onPress={handleClickOpenModal}
            >
              <FontAwesome name="plus" size={21} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Race"
              value={dogBreed}
              onChangeText={(value) => setDogBreed(value)}
              autoCorrect={true}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Poids en kg"
              value={String(weight)}
              onChangeText={(value) => setWeight(value)}
              inputMode="numeric"
            ></TextInput>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={datasex}
              search={false}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={String(sex)}
              onChange={(item) => {
                setSex(item.value);
              }}
            />
          </View>
          <TextInput
            style={styles.comment}
            placeholder="Description"
            value={comment}
            multiline={true}
            onChangeText={(value) => setComment(value)}
          ></TextInput>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <Btn
            style={{ margin: 5 }}
            title="Valider"
            onPress={handleValidation}
          />
          {editCompagnon && (
            <Btn
              style={{ margin: 15, backgroundColor: "#FF0000" }}
              title="Delete"
              onPress={handleDelete}
            />
          )}
          <ModalAvatar
            visible={isModalVisible}
            onClose={handleCloseModal}
            onSelect={handleSelectAvatar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    width: "100%",
    backgroundColor: "#E8E9ED",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#416165",
    padding: 10,
    margin: 20,
  },
  titleInput: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#416165",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 20,
    minWidth: Dimensions.get("window").width * 0.5,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    position: "relative",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  plusIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
  },
  input: {
    width: Dimensions.get("window").width * 0.6,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 10,
  },
  inputContainer: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  comment: {
    minHeight: 100,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 20,
    width: Dimensions.get("window").width * 0.8,
  },
  button: {
    marginTop: 20,
  },
  dropdown: {
    width: Dimensions.get("window").width * 0.6,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 10,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
