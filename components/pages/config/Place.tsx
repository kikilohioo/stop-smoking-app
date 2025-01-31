import { StyleSheet } from "react-native";
import { Screen } from "../../Screen";
import Table from "../../tables/Places";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { DBPlaceType } from "../../Types";

export function PlacePage() {
  const [data, setData] = useState<DBPlaceType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const result = await database.getAllAsync<DBPlaceType>(
      "SELECT * FROM places"
    );
    setData(result);
  };

  const deletePlace = async (place_id: number) => {
    try {
      await database.runAsync("DELETE FROM places where id = ?", [place_id]);
      await loadData();
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      <Table data={data} deletePlace={deletePlace} />
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
