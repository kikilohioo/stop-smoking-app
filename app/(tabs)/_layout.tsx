import { Tabs } from "expo-router";
import { ConfigIcon, HomeIcon, ListIcon } from "../../components/Icons";

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
          title: "Resumen",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Lista",
          tabBarIcon: ({ color }) => <ListIcon color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Configuracion",
          tabBarIcon: ({ color }) => <ConfigIcon color={color} size={20} />,
        }}
      />
      {/* Aqui agregar mas Tabs.Screen personalizadas */}
    </Tabs>
  );
}
