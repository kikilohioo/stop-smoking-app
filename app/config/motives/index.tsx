import { router, Stack } from "expo-router";
import { MotivePage } from "../../../components/pages/Motive";
import { IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Motives() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerTitleContainer}>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => router.push("/config/motives/modal")}
                style={styles.iconButton}
              />
            </View>
          ),
          headerTitle: "Motivos",
        }}
      />
      <MotivePage />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    paddingTop: 5
  },
  iconButton: {
    marginLeft: 10,
  },
});
