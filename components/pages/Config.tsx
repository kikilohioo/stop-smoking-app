import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Screen } from "../Screen";
import LinkButton from "../common/LinkButton";

type LinkButtonData = {
  id: string;
  label: string;
  to: string;
};

const data: LinkButtonData[] = [
  { id: "1", label: "Motivos", to: "/config/motive" },
  { id: "2", label: "Alertas", to: "/config/alert" },
  { id: "3", label: "Desencadenantes", to: "/config/trigger" },
  { id: "4", label: "Lugares", to: "/config/place" },
  { id: "4", label: "Personas", to: "/config/person" },
];

export function ConfigPage() {
  const renderItem = ({ item }: { item: LinkButtonData }) => (
    <View style={styles.item}>
      <LinkButton label={item.label} to={item.to} height={70} width={"100%"} />
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: "space-between", // Para que haya separación entre columnas
  },
  item: {
    flex: 1,
    margin: 2,
  },
});
