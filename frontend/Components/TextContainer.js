import React from "react";
import { View, StyleSheet, Text } from "react-native";

// Text Component
export default function TextContainer({ title, style }) {
  return (
    <View style={styles.container}>
      <Text style={style}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    felx: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  input: {
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    color: "#000",
  },
});
