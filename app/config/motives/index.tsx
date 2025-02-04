import { router, Stack } from "expo-router";
import { MotivePage } from "../../../components/pages/config/Motive";
import { IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Motives() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Motivos",
        }}
      />
      <MotivePage />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    paddingTop: 5,
  }
});
