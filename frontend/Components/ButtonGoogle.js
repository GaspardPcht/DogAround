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
  const [loaded, error] = useFonts({
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
