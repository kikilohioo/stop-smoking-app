import { View } from "react-native";

export function DefaultLayout({ children }) {
  return <View style={{ flex: 1, paddingTop: 10 }}>{children}</View>;
}
