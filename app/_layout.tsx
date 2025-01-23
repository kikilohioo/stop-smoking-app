import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import migrations from "../database/migrations";

const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME;

const createDbIfNeeded = async (db: SQLiteDatabase) => {
  //
  console.log("Creating database");
  try {
    // Create a table and edit for create a migration way to create multiple tables
    migrations().forEach(async (migration) => {
      const { table, attributes, foreingKeys } = migration;

      // Construir la sentencia SQL para crear la tabla
      let sql = `CREATE TABLE IF NOT EXISTS ${table} (\n`;

      // Agregar las columnas
      const columns = Object.entries(attributes)
        .map(([name, type]) => `${name} ${type}`)
        .join(",\n");

      sql += columns;

      // Agregar las claves foráneas (si las hay)
      if (foreingKeys && foreingKeys.length > 0) {
        const foreignKeysSql = foreingKeys.join(",\n");
        sql += `,\n${foreignKeysSql}`;
      }

      sql += "\n);";

      // Ejecutar la sentencia SQL en la base de datos
      const response = await db.execAsync(sql);
      console.log("Database created", response);
    });
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
            headerTitle: "NO+PUCHOS", // aca podria ir el titulo
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
