import React from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { fireBrick, fluorescentCyan } from "../../assets/palette";
import { DBMotiveType } from "../Types";
import { router } from "expo-router";
import { ConductualIcon, EmotionalIcon, PhysiologicalIcon, SocialIcon } from "../Icons";

type MotivesTableProps = {
  data: DBMotiveType[];
  deleteMotive: (motive_id: number) => Promise<boolean>;
};

const MotivesTable = ({ data, deleteMotive }: MotivesTableProps) => {
  const renderHeader = () => (
    <Surface style={styles.header}>
      <Text style={[styles.headerText, { width: 140 }]}>Nombre</Text>
      <Text style={[styles.cell, styles.headerText]}>S</Text>
      <Text style={[styles.cell, styles.headerText]}>E</Text>
      <Text style={[styles.cell, styles.headerText]}>C</Text>
      <Text style={[styles.cell, styles.headerText]}>F</Text>
      <Text style={[styles.headerText, { width: 30 }]}>-</Text>
    </Surface>
  );

  const handleOnDelete = async (motive_id: number) => {
    await deleteMotive(motive_id);
  };

  const renderRow = ({ item }: { item: MotivesTableProps["data"][0] }) => (
    <Surface style={styles.row}>
      <Text style={{ width: 130 }}>{item.name}</Text>
      <Text style={{ ...styles.cell, ...styles.slide }}>
        <SocialIcon size={15} />
        {item.social}%
      </Text>
      <Text style={{ ...styles.cell, ...styles.slide }}>
        <EmotionalIcon size={15} />
        {item.emotional}%
      </Text>
      <Text style={{ ...styles.cell, ...styles.slide }}>
        <ConductualIcon size={15} />
        {item.conductual}%
      </Text>
      <Text style={{ ...styles.cell, ...styles.slide }}>
        <PhysiologicalIcon size={15} />
        {item.physiological}%
      </Text>
      <View style={styles.actions}>
        <IconButton
          icon="pencil"
          style={styles.edit}
          size={20}
          onPress={() =>
            router.push({
              pathname: "/config/motives/modal",
              params: { motive_id: item.id },
            })
          }
        />
        <IconButton
          icon="delete"
          style={styles.delete}
          size={20}
          iconColor={fireBrick(40)}
          onPress={() => {
            if (item.id) {
              handleOnDelete(item.id)
            }
          }}
        />
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
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
  listContainer: {
    paddingBottom: 16,
  },
  actions: {
    width: 50, // Ajusta el ancho para que los iconos queden juntos
    height: 30, // Altura fija
    position: "relative", // Relativo para que los hijos con absolute se posicionen dentro
  },
  edit: {
    position: "absolute",
    height: 30,
    top: -6,
    left: -10
  },
  delete: {
    position: "absolute",
    height: 30,
    top: -6,
    right: -19
  },
  slide: {
    transform: "translateX('5px')",
  },
});

export default MotivesTable;
