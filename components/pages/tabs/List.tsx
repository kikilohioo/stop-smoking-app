import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../Screen";
import CigarsTable from "../../tables/Cigars";
import CreateCigarButton from "../../common/CreateCigarButton";

export function ListPage(){
    return (
        <Screen style={styles.screen}>
            <CigarsTable data={[]} />
            <CreateCigarButton />
        </Screen>
    );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    alignContent: "center"
  }
});
