import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Btn from "../Components/Button";
import Input from "../Components/Input";
import { useSelector } from "react-redux";

export default function MonCompteScreen({ navigation }) {
  const isFocused = useIsFocused();
  const user = useSelector((state) => state.user.value);
  const [dataCompanions, setDataCompanions] = useState([]);

  const handleClickCloseScreen = () => {
    navigation.navigate("TabNavigator", { screen: "Map" });
  };

  const handleClickOpenPreference = () => {
    navigation.navigate("Preference");
  };

  const handleClickGoToProfil = () => {
    navigation.navigate("Profil");
  }

  const handleClickGoToCompagnon = (compagnon) => {
    navigation.navigate("Compagnon", { compagnon : compagnon });
  }

  useEffect(() => {
    //Récupération donnée compagnon
    if (isFocused) {
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/companions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: user.token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setDataCompanions(data.companions);
          }
        });
    }
  }, [isFocused])

  const companions = dataCompanions.map((e, i) => {
    return (
      <View key={i} style={styles.inputRow}>
        <Text style={styles.compagnonText}>{e.name}</Text>
        <TouchableOpacity style={styles.editButton} onPress={()=>handleClickGoToCompagnon(e.name)}>
          {/* <Text style={styles.editText}>EDIT</Text> */}
          <FontAwesome
              name="pencil"
              size={18}
              color="#000"
              /* onPress={handleClickCloseScreen} */
            />
        </TouchableOpacity>
      </View>
    )
  })

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <FontAwesome
              name="gear"
              size={25}
              color="#000"
              onPress={handleClickOpenPreference}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="times"
              size={25}
              color="#000"
              onPress={handleClickCloseScreen}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>
          <Text style={styles.text}>MON COMPTE</Text>
        </Text>
        <View style={styles.inputContainer}>
          <View style={styles.avatarContainer}>
            <Image source={user.avatar} style={styles.avatar} />
          </View>
          <Input
            placeholder="pseudo"
            value={user.pseudo}
            style={styles.input}
            editable={false}
          />
          <Input
            placeholder="email"
            value={user.email}
            style={styles.input}
            editable={false}
          />
          <Btn
            title="Modifier"
            style={styles.connection}
            onPress={handleClickGoToProfil}
          />
        </View>
        <View style={styles.compagnonContainer}>
          <Text style={styles.secondText}>
            <Text style={styles.text}>MES COMPAGNONS</Text>
          </Text>
          <TouchableOpacity style={styles.plusButton} onPress={()=>handleClickGoToCompagnon('')}>
            <FontAwesome name="plus" size={25} color="#416165" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputCompagnon}>
          {companions}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E8E9ED",
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
  iconsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 8,
    backgroundColor: "#BB7E5D",
    width: "83%",
    gap: 10,
    alignItems: "center",
    padding: 30,
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
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  connection: {
    marginTop: 20,
  },
  input: {
    marginTop: 20,
  },
  secondText: {
    color: "#416165",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  compagnonContainer: {
    width: "75%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  compagnonText: {
    width: "70%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: "#000",
    fontSize: 16,
    overflow: "hidden",
  },
  plusButton: {
    alignItems: "center",
  },
  inputCompagnon: {
    width: "80%",
    marginTop: 30,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  editText: {
    color: "#000",
    fontWeight: "bold",
  },
});
