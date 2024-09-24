import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
/* import AppLoading from "expo-app-loading"; */
import * as SplashScreen from 'expo-splash-screen';


//Button component 
export default function Btn({ title, style, onPress }) {
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
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#395756",
  },
  text: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
});
