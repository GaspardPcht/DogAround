import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Btn from "../Components/Button";
import Input from "../Components/Input";
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
import ButtonGoogle from "../Components/ButtonGoogle";
import ButtonFacebook from "../Components/ButtonFacebook";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";

SplashScreen.preventAutoHideAsync();

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("H@h.com");
  const [password, setPassword] = useState("h");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

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

  const handleConnection = () => {
    // Envoie une requête POST à l'API pour se connecter
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/signin`, {
      method: "POST", // Méthode HTTP utilisée pour la requête
      headers: { "Content-Type": "application/json" }, // En-têtes de la requête
      body: JSON.stringify({
        // Corps de la requête, converti en JSON
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si la connexion a réussi
        if (data.result) {
          // Si la connexion a réussi, met à jour l'état de l'application avec les informations de l'utilisateur
          dispatch(
            login({
              email: email,
              pseudo: data.pseudo,
              city: data.city,
              avatar: data.avatar,
              token: data.token,
              favorites: data.favorites,
            })
          );
          // Réinitialise les champs du formulaire
          setEmail("");
          setPassword("");
          setErrorMessage("");
          // Navigue vers l'écran "Map" de l'application
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          // Si la connexion a échoué, affiche un message d'erreur
          setErrorMessage("Email ou Mot de passe incorrect"); // Affiche un message d'erreur si le mot de passe ou l'email est incorrect ou manquant
        }
      });
  };

  const handleClick = () => {
    // Navigue vers l'écran d'inscription
    navigation.navigate("SignUp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.welcomeText}>
            Bienvenue sur <Text style={styles.text}>DOG AROUND</Text>
          </Text>
          <Image
            source={require("../assets/logo/logo2.png")}
            style={styles.logo}
          />

          <View style={styles.inputContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              accessibilityLabel="Email Input"
              keyboardType="email-address"
            />
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              secureTextEntry
              accessibilityLabel="Password Input"
              type="password"
            />
            <Btn
              style={styles.connection}
              title="Se connecter"
              onPress={handleConnection}
            />
          </View>

          <Text style={styles.newUserText}>
            Nouveau sur <Text style={styles.text}>DOG AROUND</Text>?
          </Text>

          <Btn title="Inscription" onPress={handleClick} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E8E9ED",
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "Commissioner_700Bold",
    color: "#000",
    fontSize: 20,
    textAlign: "center",
  },
  text: {
    color: "#000",
  },
  buttonContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  connection: {
    marginTop: 20,
    marginBottom: 130,
  },
  inputContainer: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  newUserText: {
    fontFamily: "Commissioner_700Bold",
    color: "#000",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
