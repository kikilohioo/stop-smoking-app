import { StyleSheet } from "react-native";
import { Screen } from "../../Screen";
import Table from "../../tables/Persons";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { DBPersonType } from "../../Types";

export function PersonPage() {
  const [data, setData] = useState<DBPersonType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const result = await database.getAllAsync<DBPersonType>(
      "SELECT * FROM Persons"
    );
    setData(result);
  };

  const deletePerson = async (place_id: number) => {
    try {
      await database.runAsync("DELETE FROM Persons where id = ?", [place_id]);
      await loadData();
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      <Table data={data} deletePerson={deletePerson} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    alignItems: "center",
    alignContent: "center",
  },
});
