import { StyleSheet, View } from "react-native";
import { Screen } from "../../Screen";
import MotivesTable from "../../tables/Motives";
import LeaveMotivesTable from "../../tables/LeaveMotives";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect } from "expo-router";
import { DBLeaveMotiveType, DBMotiveType } from "../../Types";
import { IconButton, Text } from "react-native-paper";

export function MotivePage() {
  const [motives, setMotives] = useState<DBMotiveType[]>([]);
  const [leaveMotives, setLeaveMotives] = useState<DBLeaveMotiveType[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const motives = await database.getAllAsync<DBMotiveType>(
      "SELECT * FROM motives"
    );
    const leaveMotives = await database.getAllAsync<DBLeaveMotiveType>(
      "SELECT * FROM leave_motives"
    );
    setMotives(motives);
    setLeaveMotives(leaveMotives);
  };

  const deleteMotive = async (motive_id: number) => {
    try {
      await database.runAsync("DELETE FROM motives where id = ?", [motive_id]);
      await loadData();
      return true;
    } catch (ex) {
      return false;
    }
  };

  const deleteLeaveMotive = async (leave_motive_id: number) => {
    try {
      await database.runAsync("DELETE FROM leave_motives where id = ?", [
        leave_motive_id,
      ]);
      await loadData();
      return true;
    } catch (ex) {
      return false;
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Motivos por los que fumo</Text>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => router.push("/config/motives/modal")}
          />
        </View>
        <View style={{ ...styles.halfScreen, flex: 4 }}>
          <MotivesTable data={motives} deleteMotive={deleteMotive} />
        </View>
        <View
          style={{
            ...styles.subtitleContainer,
            paddingTop: 10,
            height: 50,
            borderTopWidth: 1,
            borderColor: "grey",
            borderStyle: "solid",
          }}
        >
          <Text style={styles.subtitle}>Motivos para dejar de fumar</Text>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => router.push("/config/motives/leave-modal")}
          />
        </View>
        <View style={{ ...styles.halfScreen, flex: 6 }}>
          <LeaveMotivesTable data={leaveMotives} deleteLeaveMotive={deleteLeaveMotive} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    alignItems: "center",
    alignContent: "center",
  },
  container: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  halfScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    height: 30,
    marginBottom: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
