import { Tabs } from "expo-router";
import { HomeIcon } from "../../components/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={15} />,
        }}
      />
      {/* Aqui agregar mas Tabs.Screen personalizadas */}
    </Tabs>
  );
}
