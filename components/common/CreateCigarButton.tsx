import { StyleSheet, TouchableOpacity } from "react-native";
import { CigarIcon } from "../Icons";
import { dutchWhite, fireBrick } from "../../assets/palette";
import { router } from "expo-router";

export default function CreateCigarButton() {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => router.push("/modal")}
    >
      <CigarIcon
        style={styles.cigarIcon}
        height={25}
        width={25}
        fill={dutchWhite(10)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    cigarIcon: {
      transform: [{translateX: -3},{translateY: -2},{rotate: "-45deg"}]
    },
    floatingButton: {
      backgroundColor: fireBrick(40), // Replace with your primary color
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 20,
      right: 20,
      elevation: 5, // For Android shadow
      shadowColor: "#000", // For iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });