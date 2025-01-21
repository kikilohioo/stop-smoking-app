import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME;

const createDbIfNeeded = async (db: SQLiteDatabase) => {
  //
  console.log("Creating database");
  try {
    // Create a table and edit for create a migration way to create multiple tables
    const response = await db.execAsync(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, image TEXT)"
    );
    console.log("Database created", response);
  } catch (error) {
    console.error("Error creating database:", error);
  }
};

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SQLiteProvider databaseName={DB_NAME} onInit={createDbIfNeeded}>
        <Stack
          screenOptions={{
            headerTitle: "" // aca podria ir el titulo
            // headerLeft: () => <Logo />,
            // headerRight: () => {
            //   return (
            //     <Link asChild href="/info">
            //       <Pressable>
            //         <InfoIcon size={40} color="black" />
            //       </Pressable>
            //     </Link>
            //   );
            // },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </View>
  );
}
