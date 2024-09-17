import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image,  } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome6";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Filter from "../Components/Filter";

import { useSelector, useDispatch } from "react-redux";
import { importPlaces } from "../reducers/places";
import { addFavorite } from "../reducers/user";
import { setPastilleMessage } from "../reducers/user";

import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

SplashScreen.preventAutoHideAsync();

export default function MapScreen({ navigation }) {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); // Récupération des paramètres de l'utilisateur stockés dans le STORE
  const places = useSelector((state) => state.places.value); // Récupération des places dans le STORE

  // Déclaration de l'état contenant la position actuelle de l'utilisateur
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 48.866667,
    longitude: 2.333333,
  });

  // Déclaration de l'état contenant la région actuelle de l'utilisateur
  const [regionPosition, setRegionPosition] = useState({
    latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // État pour afficher la modal Filter
  const [showModal, setShowModal] = useState(false);

  /* console.log(user.pastilleMessage); */

  // Fonction pour vérifier si un nouveau message est arrivé. Chargée la première fois que MapScreen s'ouvre
  const notificationMessage = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/contacts/${user.token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        try {
          let pastille = false;
          if (data.result) {
            // Récupération si un nouveau message existe sur une discussion
            for (const element of data.contacts) {
              if (
                element.invitation === "accepted" &&
                element.discussion.newMessage !== null
              ) {
                // Vérifie si le pseudo du nouveau message n'est pas celui de l'utilisateur
                if (element.discussion.newMessage.pseudo !== user.pseudo) {
                  /* console.log(element.discussion.newMessage.pseudo) */
                  pastille = true;
                  break;
                }
              }
            }
            dispatch(setPastilleMessage(pastille)); // Met à jour l'état avec la pastille de message
          } else {
            dispatch(setPastilleMessage(false)); // Pas de nouveau message
          }
        } catch {
          dispatch(setPastilleMessage(false)); // En cas d'erreur, pas de nouveau message
        }
      });
  };
  // Fonction pour récupérer les points d'intérêts autour d'une position
  const getInfoMarkers = (latitude, longitude, radius) => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/places/position/${latitude}/${longitude}/${radius}`,
      {
        method: "GET", // Méthode HTTP utilisée pour la requête
        headers: {
          "Content-Type": "application/json", // En-tête pour indiquer le type de contenu
        },
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Si la récupération des points d'intérêts a réussi, met à jour l'état avec les places
        if (data.result) {
          dispatch(importPlaces(data.places));
        }
      });
  };

  // Fonction pour valider les filtres et fermer la modal
  const validFilters = () => {
    setShowModal(false);
  };

  // Exécution une seule fois après le montage du composant
  useEffect(() => {
    notificationMessage(); // Vérifie les notifications de messages

    // Rafraîchissement des notifications de messages toutes les 10 secondes
    const interval = setInterval(() => {
      notificationMessage();
    }, 10000);

    // Nettoyage de l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []); // Dépendance vide pour exécuter l'effet une seule fois

  useEffect(() => {
    // Demande d'autorisation pour accéder à la localisation du téléphone
    if (!user.cityfield.cityname) {
      (async () => {
        const result = await Location.requestForegroundPermissionsAsync();
        const status = result.status;

        if (status === "granted") {
          // Récupération de la localisation du téléphone
          Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
            const params = {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            };

            // Récupération des points d'intérêts autour de l'utilisateur
            getInfoMarkers(params.latitude, params.longitude, user.radius);
            setCurrentPosition(location.coords); // Met à jour la position actuelle
            setRegionPosition({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }); // Met à jour la région actuelle
          });
        }
      })();
    } else {
      // Si la ville de l'utilisateur est définie, utilise ses coordonnées pour récupérer les points d'intérêts
      getInfoMarkers(
        user.cityfield.latitude,
        user.cityfield.longitude,
        user.radius
      );
      setRegionPosition({
        latitude: user.cityfield.latitude,
        longitude: user.cityfield.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }); // Met à jour la région actuelle
    }
  }, [user.cityfield.cityname]); // Dépendance sur le nom de la ville de l'utilisateur

  // Affichage des markers
  const markers = places.map((e, i) => {
    let iconName = "";
    let iconColor = "#000000";

    // Définition de l'icône et de la couleur en fonction du type de place
    if (e.type === "event") {
      iconName = "calendar";
    } else if (e.type === "favori") {
      iconName = "heart";
    } else if (e.type === "parc") {
      iconName = "tree";
      iconColor = "#00AA00";
    } else if (e.type === "animalerie") {
      iconName = "bone";
      iconColor = "#f2f473";
    } else if (e.type === "veterinaire") {
      iconName = "house-medical";
      iconColor = "#FF0000";
    } else if (e.type === "eau") {
      iconName = "faucet";
      iconColor = "#0000FF";
    } else if (e.type === "air") {
      iconName = "paw";
      iconColor = "#795C5F";
    } else if (e.type === "restaurant") {
      iconName = "location-dot";
      iconColor = "#FF0000";
    } else if (e.type === "like") {
      iconName = "location-dot";
      iconColor = "#FF0000";
    } else {
      iconName = "location-dot";
      iconColor = "#FF0000";
    }

    // Vérifie si le marker doit être affiché en fonction des filtres de l'utilisateur
    const showMarker = !user.filtres.some((filter) => e.type === filter);
    if (showMarker) {
      return (
        <Marker
          key={i + 1} // Clé unique pour chaque marker
          coordinate={e.location} // Coordonnées du marker
          onPress={() => handlePoiPress(e.google_id)} // Fonction appelée lors de la pression sur le marker
        >
          <FontAwesome name={iconName} size={40} color={iconColor} />
          {/* Icône du marker */}
        </Marker>
      );
    }
  });

  // Fonction pour gérer la pression sur un point d'intérêt
  function handlePoiPress(google_id) {
    navigation.navigate("Poi", { google_id: google_id }); // Navigation vers l'écran "Poi" avec l'ID Google du point d'intérêt
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: regionPosition.latitude,
          longitude: regionPosition.longitude,
          latitudeDelta: regionPosition.latitudeDelta,
          longitudeDelta: regionPosition.longitudeDelta,
        }}
      >
        {currentPosition && (
          <Marker
            style={styles.maposition}
            coordinate={currentPosition}
            pinColor="#fecb2d"
          >
            <Image
              source={user.avatar}
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />
          </Marker>
        )}
        {markers}
      </MapView>

      <FontAwesome
        name="filter"
        size={40}
        style={styles.filter}
        onPress={() => setShowModal(true)}
      />
      {showModal && <Filter userInfo={user} validFilters={validFilters} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  maposition: {},
  filter: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.05,
    left: Dimensions.get("window").width * 0.85,
  },
});
