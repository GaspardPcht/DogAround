import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Switch,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Input from "../Components/Input";
import Btn from "../Components/Button";
import ModalAvatar from "../Components/ModalAvatar";
import { login } from "../reducers/user";

export default function ProfilScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  // States modal visibility and switch
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || null);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [email, setEmail] = useState(user.email || "");
  const [pseudo, setPseudo] = useState(user.pseudo || "");
  const [city, setCity] = useState(user.city || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction pour naviguer vers l'écran "Compte" dans le TabNavigator
  const handleClickCloseScreen = () => {
    navigation.navigate("TabNavigator", { screen: "Compte" });
  };

  // Fonction pour gérer la modification des informations utilisateur
  const handleChangeInfos = () => {
    // Vérifie si l'utilisateur est authentifié en vérifiant la présence du token
    if (!user.token) {
      return; // Si l'utilisateur n'est pas authentifié, arrête l'exécution de la fonction
    }

    // Crée un objet data conditionnel avec les informations à mettre à jour
    const dataToUpdate = {
      avatar: selectedAvatar !== user.avatar ? selectedAvatar : undefined, // Met à jour l'avatar si différent de l'actuel
      email: email !== user.email ? email : undefined, // Met à jour l'email si différent de l'actuel
      pseudo: pseudo !== user.pseudo ? pseudo : undefined, // Met à jour le pseudo si différent de l'actuel
      city: city !== user.city ? city : undefined, // Met à jour la ville si différente de l'actuelle
      password: password.length > 0 ? password : undefined, // Met à jour le mot de passe si non vide
      newPassword: newPassword.length > 0 ? newPassword : undefined, // Met à jour le nouveau mot de passe si non vide
    };

    // Permet de filtrer les données à mettre à jour en supprimant les valeurs undefined
    const filteredData = Object.fromEntries(
      //.entries utilisée pour convertir l'objet dataToUpdate en un tableau de paires clé-valeur.
      Object.entries(dataToUpdate).filter(([key, value]) => value !== undefined)
    );

    // Ajoute le token de l'utilisateur aux données filtrées
    filteredData.token = user.token;

    // Envoie une requête PUT à l'API pour mettre à jour les informations utilisateur
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/${user.token}`, {
      method: "PUT", // Méthode HTTP utilisée pour la requête
      headers: { "Content-Type": "application/json" }, // En-têtes de la requête
      body: JSON.stringify(filteredData), // Corps de la requête, converti en JSON
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si la mise à jour a réussi
        if (data.result) {
          // Si la mise à jour a réussi, met à jour l'état de l'application avec les nouvelles informations de l'utilisateur
          dispatch(
            login({
              email: data.user.email,
              pseudo: data.user.pseudo,
              city: data.user.city,
              token: data.user.token,
              avatar: data.user.avatar,
            })
          );
          // Réinitialise les champs de mot de passe
          setPassword("");
          setNewPassword("");
          setErrorMessage("");
          // Navigue vers l'écran "Compte" de l'application
          navigation.navigate("TabNavigator", { screen: "Compte" });
        } else {
          // Si la mise à jour a échoué, affiche un message d'erreur
          setErrorMessage("Information invalide");
        }
      });
  };

  // Fonction pour ouvrir le modal
  const handleClickOpenModal = () => {
    setIsModalVisible(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Fonction pour sélectionner un avatar et fermer le modal
  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar.source);
    setIsModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClickCloseScreen}>
            <FontAwesome name="times" size={25} color="#000" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.welcomeText}>
            <Text style={styles.text}>PROFIL</Text>
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Image source={selectedAvatar} style={styles.avatar} />
            </View>
            <TouchableOpacity
              style={styles.plusIcon}
              onPress={handleClickOpenModal}
            >
              <FontAwesome name="plus" size={21} color="#BB7E5D" />
            </TouchableOpacity>
          </View>
          <Input
            placeholder="pseudo"
            value={pseudo}
            onChangeText={(text) => setPseudo(text)}
            style={styles.input}
          />
          <Input
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <Input
            placeholder="Ville"
            value={city}
            onChangeText={(text) => setCity(text)}
            style={styles.input}
          />
          <Input
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <Input
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: "#BB7E5D", true: "#C9C9C9" }}
              thumbColor={isEnabled ? "#395756" : "#395756"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={styles.switchText}>
              {isEnabled ? "Profil Privé" : "Profil Public"}
            </Text>
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <Btn
            title="Modifier"
            style={styles.connection}
            onPress={handleChangeInfos}
          />
        </View>
        <ModalAvatar
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSelect={handleSelectAvatar}
        />
      </View>
    </ScrollView>
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
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
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
    borderRadius: 8,
    width: "100%",
    gap: 10,
    alignItems: "center",
    padding: 30,
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    position: "relative",
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
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  plusIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#416165",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  connection: {
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    marginTop: 20,
  },
});
