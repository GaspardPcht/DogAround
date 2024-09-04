import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Btn from "../Components/Button";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/user";

//Input qui prend juste du Text avec la props title
import TextContainer from "../Components/TextContainer";

export default function PreferenceScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleClickCloseScreen = () => {
    navigation.navigate("Compte");
  };

  const handleClickDeconnexion = () => {
    dispatch(logout());
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleClickCloseScreen}
        style={styles.iconButton}
      >
        <FontAwesome name="times" size={25} color="#000" />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>
        <Text style={styles.text}>MES PREFERENCES</Text>
      </Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.buttonInput}>
          <TextContainer
            style={styles.buttonText}
            title="POLITIQUE DE CONFIDENTIALITÉ"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInput}>
          <TextContainer style={styles.buttonText} title="SÉCURITÉ" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInput}>
          <TextContainer
            style={styles.buttonText}
            title="CENTRE D’ASSISTANCE"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInput}>
          <TextContainer style={styles.buttonText} title="NOUS CONTACTER" />
        </TouchableOpacity>
        <Btn
          title="Deconnexion"
          style={styles.connection}
          onPress={handleClickDeconnexion}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#E8E9ED",
  },
  iconButton: {
    position: "absolute",
    top: 20,
    right: 20,
    marginTop: 20,
  },
  welcomeText: {
    marginBottom: 30,
  },
  text: {
    color: "#416165",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Commissioner_700Bold",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    padding: 30,
  },
  buttonInput: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#416165",
    fontSize: 16,
    fontWeight: "normal",
  },
  connection: {
    marginTop: 50,
  },
});
