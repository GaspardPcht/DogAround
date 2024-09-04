import React from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import Btn from "./Button";

const ModalInvitation = ({ visible, onClose, onSelect, name }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Inviter {name} ?</Text>
          <View style={styles.modalButtonContainer}>
            <Btn title="Inviter" onPress={onSelect} style={styles.button} />
            <Btn title="Annuler" onPress={onClose} style={styles.button} />
          </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "105%",
  },
  button: {
    marginHorizontal: 5,
    width:130,

  },
});

export default ModalInvitation;
