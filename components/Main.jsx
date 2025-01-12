import { Text } from "react-native";
import { DefaultLayout } from "./DefaultLayout";

export function Main() {
  return (
    <DefaultLayout>
      <Text style={{ fontSize: 30, color: "black" }}>Hola mundo</Text>
    </DefaultLayout>
  );
}
