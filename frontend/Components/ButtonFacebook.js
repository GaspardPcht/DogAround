import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
/* import AppLoading from "expo-app-loading"; */
import * as SplashScreen from 'expo-splash-screen';

//Button Facebook component 
export default function ButtonFacebook({ onPress }) {
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
          source={require("../assets/logo/logo-facebook.png")}
          style={styles.logo}
        />
        <Text style={styles.text}>Facebook</Text>
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
    width: 110,
    padding: 10,
    fontSize: 14,
    textAlign: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#3b5998",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  logo: {
    width: 24,
    height: 24,
    color: "#fff",
    backgroundColor: "#3b5998",
  },
});
