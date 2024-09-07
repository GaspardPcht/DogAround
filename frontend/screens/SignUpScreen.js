import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions
} from "react-native"; 
import {
  useFonts,
  Commissioner_400Regular,
  Commissioner_500Medium,
  Commissioner_600SemiBold,
  Commissioner_700Bold,
} from "@expo-google-fonts/commissioner";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useDispatch } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import Input from "../Components/Input";
import Btn from "../Components/Button";
import ButtonFacebook from "../Components/ButtonFacebook";
import ButtonGoogle from "../Components/ButtonGoogle";
import { login } from "../reducers/user";

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

export default function SignUpScreen({ navigation }) {
  const [loaded, error] = useFonts({
    Commissioner_400Regular,
    Commissioner_500Medium,
    Commissioner_600SemiBold,
    Commissioner_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  //Raz ville
  const onClearPress = () => {
    setSuggestionsList([]); // Efface la liste des suggestions en la remplaçant par un tableau vide
  };

  //Recherche ville
  const getSuggestions = (query) => {
    // Empêche la recherche avec une requête vide
    if (query === "") {
      return;
    }

    // Effectue une requête à l'API pour obtenir des suggestions de villes
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${query}&type=municipality&autocomplete=0`
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        try {
          if (data.features) {
            // Si des fonctionnalités sont présentes dans les données de réponse
            // Crée une liste de suggestions en extrayant le nom de chaque fonctionnalité
            const suggestions = data.features.map((data, i) => {
              return { id: i + 1, title: data.properties.name };
            });
            setSuggestionsList(suggestions); // Met à jour la liste des suggestions avec les nouvelles suggestions
          } else {
            setSuggestionsList([]); // Si aucune fonctionnalité n'est présente, efface la liste des suggestions
          }
        } catch {
          setSuggestionsList([]); // En cas d'erreur, efface la liste des suggestions
        }
      });
  };

  const handleRegister = () => {
    // Vérifie si les mots de passe correspondent
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas"); // Affiche un message d'erreur si les mots de passe ne correspondent pas
      return; // Arrête l'exécution de la fonction
    }

    // Envoie une requête POST à l'API pour enregistrer un nouvel utilisateur
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/signup`, {
      method: "POST", // Méthode HTTP utilisée pour la requête
      headers: { "Content-Type": "application/json" }, // En-têtes de la requête
      body: JSON.stringify({
        // Corps de la requête, converti en JSON
        avatar: 34,
        email: email,
        pseudo: pseudo,
        password: password,
        surname: surname,
        name: name,
        city: city,
      }),
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si l'enregistrement a réussi
        if (data.result) {
          // Si l'enregistrement a réussi, met à jour l'état de l'application avec les informations de l'utilisateur
          dispatch(
            login({
              email,
              pseudo: data.pseudo,
              city,
              avatar: data.avatar,
              token: data.token,
            })
          );
          // Réinitialise les champs du formulaire
          setEmail("");
          setPseudo("");
          setPassword("");
          setConfirmPassword("");
          setSurname("");
          setName("");
          setCity("");
          setErrorMessage("");
          // Navigue vers l'écran "Map" de l'application
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          // Si l'enregistrement a échoué, affiche un message d'erreur
          setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
      });
  };

  // Utilise useEffect pour exécuter du code après le rendu du composant
  useEffect(() => {
    // Si les ressources sont chargées ou s'il y a une erreur, cache l'écran de démarrage
    if (loaded || error) {
      SplashScreen.hideAsync(); // Cache l'écran de démarrage de manière asynchrone
    }
  }, [loaded, error]); // Dépendances : le code s'exécute lorsque 'loaded' ou 'error' change

  // Si les ressources ne sont pas encore chargées et qu'il n'y a pas d'erreur, ne rien rendre (retourne null)
  if (!loaded && !error) {
    return null; // Ne rend rien tant que les ressources ne sont pas prêtes
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.newUserText}>
            Nouveau sur <Text style={styles.text}>DOG AROUND</Text>?
          </Text>

          <View style={styles.socialContainer}>
            <Text style={styles.textConnection}>Connectez-vous via: </Text>
            <View style={styles.buttonContainer}>
              <ButtonGoogle />
              <ButtonFacebook />
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.mailContainer}>
            <Text style={styles.textMail}>Ou par mail: </Text>
            <View style={styles.inputContainer}>
              <Input
                placeholder="E-mail *"
                accessibilityLabel="Email Input"
                value={email}
                onChangeText={setEmail}
              />
              <AutocompleteDropdown
                emptyResultText="Aucun résultat"
                debounce={500}
                onChangeText={(value) => getSuggestions(value)}
                onSelectItem={(item) => item && setCity(item.title)}
                dataSet={suggestionsList}
                textInputProps={{
                  placeholder: "Ville",
                  style: {
                    fontSize: 14,
                  },
                }}
                direction={Platform.select({ ios: "down" })}
                inputContainerStyle={styles.inputdropdownContainer}
                containerStyle={styles.dropdownContainer}
                suggestionsListContainerStyle={styles.suggestionListContainer}
                suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
                clearOnFocus={false}
                closeOnSubmit={true}
                onClear={() => onClearPress()}
              />
              <Input
                placeholder="Pseudo *"
                accessibilityLabel="Username Input"
                value={pseudo}
                onChangeText={setPseudo}
              />
              <Input
                placeholder="Prénom"
                accessibilityLabel="Surname Input"
                value={surname}
                onChangeText={setSurname}
              />
              <Input
                placeholder="Nom"
                accessibilityLabel="Name Input"
                value={name}
                onChangeText={setName}
              />
              {/* <Input
                placeholder="Ville"
                accessibilityLabel="City Input"
                value={city}
                onChangeText={setCity}
              /> */}
              <Input
                placeholder="Mot de passe *"
                accessibilityLabel="Password Input"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Input
                placeholder="Confirmer Mot de passe *"
                accessibilityLabel="Confirm Password Input"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Btn
                style={styles.connection}
                title="Valider"
                onPress={handleRegister}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E9ED",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontFamily: "Commissioner_700Bold",
    color: "#BB7E5D",
  },
  newUserText: {
    fontFamily: "Commissioner_700Bold",
    color: "#416165",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  inputContainer: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  buttonContainer: {
    width: "60%",
    gap: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textConnection: {
    fontFamily: "Commissioner_700Bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  textMail: {
    fontFamily: "Commissioner_700Bold",
    fontSize: 16,
    marginBottom: 10,
  },
  mailContainer: {
    width: "100%",
    alignItems: "center",
  },
  connection: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  dropdownContainer: {
    width: '80%',
  },

  inputdropdownContainer: {
    backgroundColor: '#ffffff',
  },

  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
  },
});
