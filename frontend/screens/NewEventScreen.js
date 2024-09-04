import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { addEvent } from "../reducers/event";
import Btn from "../Components/Button";

export default function NewEventScreen({ navigation, route }) {
  const { image, nom } = route.params;
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [horaires, setHoraires] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();

  const handleClickCloseScreen = () => {
    navigation.goBack();
  };

  const handleClickToCreate = () => {
    dispatch(addEvent({ nom: name, date, horaires, description }));
    navigation.goBack();
  };

  //Function pour ouvrir la modal date
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setDate(currentDate.toLocaleDateString()); 
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
      <View style={styles.inputContainer}>
        <View style={styles.nameContainer}>
          <TextInput
            style={styles.inputName}
            placeholder="Nom"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.inputDate}>
                <Text style={styles.inputDateText}>
                  {date || "Ecrivez-ici"}
                </Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Horaires:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ecrivez-ici"
              value={horaires}
              onChangeText={setHoraires}
            />
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.inputDescription}
            placeholder="Description:"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </View>
      <Btn style={styles.btn} title="Crée" onPress={handleClickToCreate} />
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
  inputContainer: {
    width: "80%",
    marginTop: 60,
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  dateTimeContainer: {
    marginBottom: 30,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionContainer: {
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  inputDate: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginLeft: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  inputDateText: {
    color: "#000",
  },
  inputDescription: {
    width: "100%",
    height: 120,
    backgroundColor: "#FFF",
    textAlignVertical: "top",
    marginBottom: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    padding: 13,
  },
  inputName: {
    width: "100%",
    height: 40,
    textAlign: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  btn: {
    marginTop: 40,
  },
});
