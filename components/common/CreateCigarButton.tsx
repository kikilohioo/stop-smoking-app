import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CigarIcon, MordidaIcon } from "../Icons";
import { dutchWhite, fireBrick } from "../../assets/palette";
import { router } from "expo-router";

export default function CreateCigarButton() {
  return (
    <View style={styles.floatingSurface}>
      <MordidaIcon
        width={69}
        height={69}
        fill={fireBrick(40)}
        style={styles.mordidaLeft}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/modal")}
      >
        <CigarIcon
          style={styles.cigarIcon}
          height={20}
          width={20}
          fill={dutchWhite(10)}
        />
      </TouchableOpacity>
      <MordidaIcon
        width={69}
        height={69}
        fill={fireBrick(40)}
        style={styles.mordidaRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cigarIcon: {
    transform: [{ translateX: -2 }, { translateY: -1 }, { rotate: "-45deg" }]
  },
  floatingSurface: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    height: 10,
    backgroundColor: fireBrick(40),
    position: "relative", // Asegura que los hijos se posicionen correctamente
    overflow: "visible",
    zIndex: 1
  },
  floatingButton: {
    backgroundColor: fireBrick(40), // Replace with your primary color
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transform: [{
      translateY: -22
    }],
    elevation: 3,
    zIndex: 2
  },
  mordidaLeft: {
    marginLeft: "auto",
    width: 50,
    color: fireBrick(40),
    transform: [{
      translateY: -19
    },
    {
      translateX: 22
    },
    {
      scaleX: -1
    }],
  },
  mordidaRight: {
    marginRight: "auto",
    width: 50,
    color: fireBrick(40),
    transform: [{
      translateY: -19
    }, {
      translateX: -22
    }],
    position: "relative",
    zIndex: 1
  },
});