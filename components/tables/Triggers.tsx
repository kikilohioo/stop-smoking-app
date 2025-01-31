import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { fireBrick, fluorescentCyan } from "../../assets/palette";
import { DBTriggerType } from "../Types";
import { router } from "expo-router";

type TriggersTableProps = {
  data: DBTriggerType[];
  deleteTrigger: (trigger_id: number) => Promise<boolean>;
};

const TriggersTable = ({ data, deleteTrigger }: TriggersTableProps) => {
  const renderHeader = () => (
    <Surface style={styles.header}>
      <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
      <Text style={[styles.cellActions, styles.headerText]}>Acciones</Text>
    </Surface>
  );

  const handleOnDelete = async (trigger_id: number) => {
    await deleteTrigger(trigger_id);
  };

  const renderRow = ({ item }: { item: TriggersTableProps["data"][0] }) => (
    <Surface style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <View style={styles.actions}>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() =>
            router.push({
              pathname: "/config/triggers/modal",
              params: { trigger_id: item.id },
            })
          }
        />
        <IconButton
          icon="delete"
          size={20}
          iconColor={fireBrick(40)}
          onPress={() => handleOnDelete(item.id)}
        />
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    backgroundColor: fluorescentCyan(62),
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    elevation: 2,
  },
  cell: {
    display: "flex",
    flex: 3,
    fontSize: 12,
    textAlign: "left",
    alignItems: "center",
    textAlignVertical: "center",
  },
  cellActions: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    gap: 4,
  },
});

export default TriggersTable;
