import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
} from "react-native";

import FontAwesome from 'react-native-vector-icons/FontAwesome6'

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Filter from '../Components/Filter'

import { useSelector, useDispatch } from 'react-redux';
import { importPlaces } from '../reducers/places'
import { addFavorite } from '../reducers/user'
import { setPastilleMessage } from '../reducers/user'

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
    const user = useSelector((state) => state.user.value); //Recuperation paramètres de l'utilsateur stocké dans le STORE
    const places = useSelector((state) => state.places.value); //Recuperation des places dans le STORE
    const [currentPosition, setCurrentPosition] = useState({ "latitude": 48.866667, "longitude": 2.333333 }); //Déclaration état contenant la position de l'utisateur
    const [regionPosition, setRegionPosition] = useState({ "latitude": 48.866667, "longitude": 2.333333, "latitudeDelta": 0.05, "longitudeDelta": 0.05 }); //Déclaration état contenant la position de l'utisateur
    const [showModal, setShowModal] = useState(false); //Affiche la modal Filter

    /* console.log(user.pastilleMessage); */

    //Fonction vérification si un nouveau message est arrivé. Chargé la 1ère fois que MapScreen s'ouvre
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
            .then((response) => response.json())
            .then((data) => {
                try {
                    let pastille = false;
                    if (data.result) {
                        //Récupération si un nouveau message existe sur une discussion
                        for (const element of data.contacts) {
                            if ((element.invitation === "accepted") && (element.discussion.newMessage !== null)) {
                                //nouveau IF car element.discussion.newMessage.pseudo n'existe pas toujours
                                if (element.discussion.newMessage.pseudo !== user.pseudo) {
                                    /* console.log(element.discussion.newMessage.pseudo) */
                                    pastille = true;
                                    break;
                                }
                            }
                        }
                        dispatch(setPastilleMessage(pastille))
                    }
                    else {
                        dispatch(setPastilleMessage(false))
                    }
                }
                catch {
                    dispatch(setPastilleMessage(false))
                }
            });
    };

    //Fonction Récupération des points d'intérêts autour d'une position'
    const getInfoMarkers = (latitude, longitude, radius) => {
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/places/position/${latitude}/${longitude}/${radius}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.result && dispatch(importPlaces(data.places));
            });
    }

    //Fonction mise à jour des filtres
    const validFilters = () => {
        setShowModal(false);
    }

    //Execution une seul fois
    useEffect(() => {
        notificationMessage();
        //Rafraichissement notification des messages
        const interval = setInterval(() => {
            notificationMessage();
        }, 10000);

        //Raz Interval
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        //Demande autorisation partage location du téléphone
        if (!user.cityfield.cityname) {

            (async () => {
                const result = await Location.requestForegroundPermissionsAsync();
                const status = result.status;

                if (status === 'granted') {
                    //Récupération location du téléphone
                    Location.watchPositionAsync({ distanceInterval: 10 },
                        (location) => {
                            const params = {
                                longitude: location.coords.longitude,
                                latitude: location.coords.latitude,
                            };

                            //Récupération des points d'intérêts autour de l'utilisateur
                            getInfoMarkers(params.latitude, params.longitude, user.radius);
                            setCurrentPosition(location.coords);
                            setRegionPosition({
                                "latitude": location.coords.latitude,
                                "longitude": location.coords.longitude,
                                "latitudeDelta": 0.05,
                                "longitudeDelta": 0.05,
                            });
                        });
                }
            })();
        }
        else {
            getInfoMarkers(user.cityfield.latitude, user.cityfield.longitude, user.radius);
            setRegionPosition({
                "latitude": user.cityfield.latitude,
                "longitude": user.cityfield.longitude,
                "latitudeDelta": 0.05,
                "longitudeDelta": 0.05,
            });
        };
    }, [user.cityfield.cityname]);

    //Affichage des markers
    const markers = places.map((e, i) => {
        let iconName = '';
        let iconColor = '#000000';

        if (e.type === 'event') {
            iconName = 'calendar';
        }
        else if (e.type === 'favori') {
            iconName = 'heart';
        }
        else if (e.type === 'parc') {
            iconName = 'tree';
            iconColor = '#00AA00';
        }
        else if (e.type === 'animalerie') {
            iconName = 'bone';
            iconColor = '#f2f473';
        }
        else if (e.type === 'veterinaire') {
            iconName = 'house-medical';
            iconColor = '#FF0000';
        }
        else if (e.type === 'eau') {
            iconName = 'faucet';
            iconColor = '#0000FF';
        }
        else if (e.type === 'air') {
            iconName = 'paw';
            iconColor = '#795C5F';
        }
        else if (e.type === 'restaurant') {
            iconName = 'location-dot';
            iconColor = '#FF0000';
        }
        else if (e.type === 'like') {
            iconName = 'location-dot';
            iconColor = '#FF0000';
        }
        else {
            iconName = 'location-dot';
            iconColor = '#FF0000';
        }

      
        const showMarker = !user.filtres.some(filter => e.type === filter);
        if (showMarker) {
            return (
                <Marker key={i + 1} coordinate={e.location} onPress={() => handlePoiPress(e.google_id)}>
                    <FontAwesome name={iconName} size={40} color={iconColor} />
                </Marker>
            )
        }
    })

    function handlePoiPress(google_id) {
        //fetch création POI
        // console.log('dans le if')
        // const location = data.place.location
        // fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/places/new/${id}/${location}`,{
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ 
        //     title : data.place.nom,
        //     description: data.place.description,
        //     hours: data.place.horaires,
        //     categorie: data.place.categorie,
        //     location: poidata.placeInfos.location,
        //     image: data.place.image,
        //     created_at: now,
        //   })
        // })
        // .then((response) => response.json())
        // .then((newPlaceData) => {
        //  console.log('newPlace: ', newPlaceData)
        // })
        navigation.navigate('Poi',{google_id:google_id})
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
                {currentPosition &&
                    <Marker style={styles.maposition} coordinate={currentPosition} title="you waf here !" pinColor="#fecb2d">
                        <Image
                            source={user.avatar}
                            style={{ width: 40, height: 40, resizeMode: "contain" }}
                        />
                    </Marker>}
                {markers}
            </MapView>

            <FontAwesome name="filter" size={40} style={styles.filter} onPress={() => setShowModal(true)} />
            {showModal && <Filter userInfo={user} validFilters={validFilters} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    maposition: {

    },
    filter: {
        position: "absolute",
        top: Dimensions.get('window').height * 0.05,
        left: Dimensions.get('window').width * 0.85,
    },
});
