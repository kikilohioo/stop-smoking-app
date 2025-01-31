import { StyleSheet } from "react-native";
import { Screen } from "../../Screen";
import Table from "../../tables/Triggers";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { DBTriggerType } from "../../Types";

export function TriggerPage() {
  const [data, setData] = useState<DBTriggerType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const result = await database.getAllAsync<DBTriggerType>(
      "SELECT * FROM triggers"
    );
    setData(result);
  };

  const deleteTrigger = async (place_id: number) => {
    try {
      await database.runAsync("DELETE FROM triggers where id = ?", [place_id]);
      await loadData();
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      <Table data={data} deleteTrigger={deleteTrigger} />
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
