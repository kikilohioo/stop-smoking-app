import { router } from "expo-router";
import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ScrrenProps = {
  label: string;
  to: string;
  width: DimensionValue;
  height: DimensionValue;
};

export default function LinkButton({ label, to, width, height }: ScrrenProps) {
  const styles = StyleSheet.create({
    button: {
      height: height,
      width: width,
      marginInline: "auto",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      backgroundColor: "#ededed",
      alignContent: "flex-end",
      borderColor: "grey",
      borderStyle: "solid",
      borderWidth: 1,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(to);
      }}
      style={{ ...styles.button, width, height }}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}
