import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Screen } from "../../Screen";
import LinkButton from "../../common/LinkButton";
import CreateCigarButton from "../../common/CreateCigarButton";

type LinkButtonData = {
  id: string;
  label: string;
  to: string;
};

const data: LinkButtonData[] = [
  { id: "1", label: "Motivos", to: "/config/motives/" },
  { id: "2", label: "Alertas", to: "/config/alerts/" },
  { id: "3", label: "Desencadenantes", to: "/config/triggers/" },
  { id: "4", label: "Lugares", to: "/config/places/" },
  { id: "4", label: "Personas", to: "/config/persons/" },
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
      <CreateCigarButton />
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
