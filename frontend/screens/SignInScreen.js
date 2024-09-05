import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
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
  const [password, setPassword] = useState("H");
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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleConnection = () => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
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
          setEmail("");
          setPassword("");
          setErrorMessage("");
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          setErrorMessage("Email ou Mot de passe incorrect"); // affiche un message d'error si le mdp ou email pas bon ou manquant
        }
      });
  };

  const handleClick = () => {
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
          <View style={styles.buttonContainer}>
            <ButtonGoogle />
            <ButtonFacebook />
          </View>

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
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: "Commissioner_700Bold",
    color: "#416165",
    fontSize: 20,
    textAlign: "center",
  },
  text: {
    color: "#BB7E5D",
  },
  buttonContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  connection: {
    marginTop: 20,
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
    color: "#416165",
    fontSize: 20,
    textAlign: "center",
  },
});
