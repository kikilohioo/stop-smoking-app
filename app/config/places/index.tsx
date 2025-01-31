import { router, Stack } from "expo-router";
import { PlacePage } from "../../../components/pages/config/Place";
import { IconButton } from "react-native-paper";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Places() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerTitleContainer}>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => router.push("/config/places/modal")}
                style={styles.iconButton}
              />
            </View>
          ),
          headerTitle: "Lugares",
        }}
      />
      <PlacePage />
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
