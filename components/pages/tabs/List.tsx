import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../Screen";

export function ListPage(){
    return (
        <Screen style={styles.screen}>
            <Text>List screen</Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    alignContent: "center"
  }
});
