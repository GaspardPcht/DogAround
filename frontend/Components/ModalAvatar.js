import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import Btn from "./Button";
import Correspondance from "../assets/avatars/Correspondance";

const ModalAvatar = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choisir un avatar</Text>
          <FlatList
            data={Correspondance}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.avatarItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Image source={item.source} style={styles.avatarImage} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity style={styles.modalButton}>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    height:'80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  avatarItem: {
    flex: 1,
    margin: 40,
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default ModalAvatar;
