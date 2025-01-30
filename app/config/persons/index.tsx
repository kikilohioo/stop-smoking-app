import { router, Stack } from "expo-router";
import { PersonPage } from "../../../components/pages/config/Person";
import { IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Persons() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerTitleContainer}>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => router.push("/config/persons/modal")}
                style={styles.iconButton}
              />
            </View>
          ),
          headerTitle: "Personas",
        }}
      />
      <PersonPage />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    paddingTop: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
});
