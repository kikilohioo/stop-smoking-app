import { StyleSheet } from "react-native";
import { Screen } from "../../Screen";
import Table from "../../tables/Motives";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { DBMotiveType } from "../../Types";

export function MotivePage() {
  const [data, setData] = useState<DBMotiveType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const result = await database.getAllAsync<DBMotiveType>(
      "SELECT * FROM motives"
    );
    setData(result);
  };

  const deleteMotive = async (motive_id: number) => {
    try {
      await database.runAsync("DELETE FROM motives where id = ?", [motive_id]);
      await loadData();
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      <Table data={data} deleteMotive={deleteMotive} />
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
