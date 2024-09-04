import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function EventScreen({ navigation, route }) {
  const { image, nom } = route.params;
  const event = useSelector((store) => store.event.value);

  const handleClickCloseScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleClickCloseScreen}
        style={styles.closeIcon}
      >
        <FontAwesome name="times" size={25} color="#FFF" />
      </TouchableOpacity>
      <Image source={{ uri: image }} style={styles.headerImage} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{nom}</Text>
      </View>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.name}>{event.nom}</Text>
        <View style={styles.eventDetailContainer}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.eventDetail}>{event.date}</Text>
        </View>
        <View style={styles.eventDetailContainer}>
          <Text style={styles.label}>Horaires:</Text>
          <Text style={styles.eventDetail}>
            {event.horaires || "Pas d'horaires définis"}
          </Text>
        </View>
        <Text style={styles.label}>Description:</Text>
        <View style={styles.eventDetailContainer}>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#E8E9ED",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  headerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  titleContainer: {
    top: 104,
    position: "absolute",
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  eventDetailsContainer: {
    width: "80%",
    marginTop: 60,
  },
  eventDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#416165",
  },
  eventDetail: {
    flex: 1,
    fontSize: 16,
    paddingBottom: 5,
  },
  name: {
    color: "#416165",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Commissioner_700Bold",
    marginBottom: 60,
    textAlign: "center",
  },
  eventDescription: {
    fontSize: 16,
    color: "#000",
    backgroundColor: "#FFF",
    padding: 13,
    borderRadius: 8,
    textAlignVertical: "top",
    minHeight: 200,
    flex: 1,
    marginTop: 5,
  },
});
