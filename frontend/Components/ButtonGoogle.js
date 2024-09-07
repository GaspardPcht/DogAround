import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from 'expo-splash-screen';

//Button Google component 
export default function ButtonGoogle(onPress) {
  // Chargement des polices avec useFonts
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Utilisation de useEffect pour cacher l'écran de démarrage lorsque les polices sont chargées ou en cas d'erreur
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Cache l'écran de démarrage
    }
  }, [loaded, error]);

  // Si les polices ne sont pas encore chargées et qu'il n'y a pas d'erreur, retourne null
  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Image
          source={require("../assets/logo/logo-google.png")}
          style={styles.logo}
        />
        <Text style={styles.text}>Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    maxWidth: 320,
    width: 110,
    padding: 10,
    fontSize: 14,
    textAlign: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Poppins_700Bold",
  },
  logo: {
    width: 24,
    height: 24,
  },
});
