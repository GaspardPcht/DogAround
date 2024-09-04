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
        /* console.log(data) */
        try {
          if (data.features) {
            const suggestions = data.features.map((data, i) => {
              return { id: (i + 1), title: data.properties.name };
            });
            setSuggestionsList(suggestions);
          }
          else {
            setSuggestionsList([]);
          }
        }
        catch {
          setSuggestionsList([]);
        }
      });

  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatar: 34,
        email: email,
        pseudo: pseudo,
        password: password,
        surname: surname,
        name: name,
        city: city,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              email,
              pseudo: data.pseudo,
              city,
              avatar: data.avatar,
              token: data.token,
            })
          );
          setEmail("");
          setPseudo("");
          setPassword("");
          setConfirmPassword("");
          setSurname("");
          setName("");
          setCity("");
          setErrorMessage("");
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
      })
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
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
                  placeholder: 'Ville',
                  style: {
                    fontSize: 14,
                  },
                }}
                direction={Platform.select({ ios: 'down' })}
                inputContainerStyle={styles.inputdropdownContainer}
                containerStyle={styles.dropdownContainer}
                suggestionsListContainerStyle={styles.suggestionListContainer}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
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
