import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { fireBrick, fluorescentCyan } from "../../assets/palette";
import { DBCigarType } from "../Types";
import { router } from "expo-router";

type CigarsTableProps = {
  data: DBCigarType[];
};

const CigarsTable = ({ data }: CigarsTableProps) => {
  const renderHeader = () => (
    <Surface style={styles.header}>
      <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
      <Text style={[styles.cellActions, styles.headerText]}>Acciones</Text>
    </Surface>
  );

  const renderRow = ({ item }: { item: CigarsTableProps["data"][0] }) => (
    <Surface style={styles.row}>
      <Text style={styles.cell}>{item.date_time}</Text>
      <View style={styles.actions}>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() =>
            router.push({
              pathname: "/modal",
              params: { cigar_id: item.id },
            })
          }
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

export default CigarsTable;
