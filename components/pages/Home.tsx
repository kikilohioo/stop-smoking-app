import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Screen } from "../Screen";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect } from "expo-router";

export function HomePage() {
  const [data, setData] = useState<
    { id: number; name: string; email: string }[]
  >([]);
  const database = useSQLiteContext();
  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );
  const loadData = async () => {
    const result = await database.getAllAsync<{
      id: number;
      name: string;
      email: string;
    }>("SELECT * FROM users");
    setData(result);
  };

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>DB TEST USERS:</Text>
      <FlatList
        style={{ width: "100%" }}
        data={data}
        renderItem={({
          item
        }: {
          item: { id: number; name: string; email: string };
        }) => (
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  screen: {
    alignItems: "center",
    alignContent: "center"
  }
});
