import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import migrations from "../database/migrations";
import seeders from "../database/seeders";
import { Seeder } from "../components/Types";

const DB_NAME = process.env.EXPO_PUBLIC_DB_NAME;

const createDbIfNeeded = async (db: SQLiteDatabase) => {
  //
  console.log("Creating database");
  try {
    let dataToInsert = seeders() as Seeder<any>[];
    // Create a table and edit for create a migration way to create multiple tables
    migrations().forEach(async (migration) => {
      const { table, attributes, foreingKeys } = migration;

      await db.execAsync(`DROP TABLE IF EXISTS ${table}`);

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
      console.log(`Table ${table} created: `, response);

      // inserts de los seeders de esta tabla
      // Buscar si hay seeders para esta tabla
      const seeder = dataToInsert.find((item) => item.table === table);
      if (!seeder) return;

      const { data } = seeder;
      if (data.length === 0) return;

      const keys = Object.keys(data[0]).join(", ");
      const values = data
        .map(
          (row: Record<string, unknown>) =>
            `(${Object.values(row)
              .map((value) =>
                typeof value === "string"
                  ? `'${value.replace(/'/g, "''")}'`
                  : value
              )
              .join(", ")})`
        )
        .join(", ");

      const insertSql = `INSERT INTO ${table} (${keys}) VALUES ${values};`;

      console.log(insertSql);
      await db.execAsync(insertSql);
      console.log(`Data for table ${table} inserted.`);
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
