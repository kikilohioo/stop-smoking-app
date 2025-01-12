import { Tabs, Stack } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <View style={{ flex: 1 }}>
        <Stack />
      </View>
    </Tabs>
  );
}
