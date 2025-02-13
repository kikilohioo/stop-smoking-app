import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../Screen";
import CigarsTable from "../../tables/Cigars";
import CreateCigarButton from "../../common/CreateCigarButton";
import { DBCigarType } from "../../Types";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

export function ListPage() {
  const [cigars, setCigars] = useState<DBCigarType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const cigars = await database.getAllAsync<DBCigarType>(
      "SELECT * FROM cigars"
    );
    setCigars(cigars);
  };

  return (
    <Screen style={styles.screen}>
      <CigarsTable data={cigars} />
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
