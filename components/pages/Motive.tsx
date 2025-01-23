import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../Screen";

export function MotivePage() {
  return (
    <Screen style={styles.screen}>
      <Text>Motive screen</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    alignContent: "center",
  },
});
