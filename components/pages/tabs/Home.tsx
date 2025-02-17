import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Screen } from "../../Screen";
import { DBCigarPersonType, DBCigarType, DBPersonType } from "../../Types";
import { LineChart } from "react-native-chart-kit";
import { fluorescentCyan, marianBlue, teal } from "../../../assets/palette";
import { Link, useFocusEffect } from "expo-router";
import {
  ConductualIcon,
  EmotionalIcon,
  LocationIcon,
  PersonIcon,
  PhysiologicalIcon,
  RightRow,
  RightShortRow,
  SocialIcon,
} from "../../Icons";
import CreateCigarButton from "../../common/CreateCigarButton";
import { ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

// const screenWidth = Dimensions.get("window").width;
type LineChartData = {
  data: number[];
  color?: () => string;
};

type DBCigarWithPlace = DBCigarType & { name: string };

export function HomePage() {
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
  const [actualWeekCountCigars, setActualWeekCountCigars] = useState<number>(0);
  const [lastWeekCountCigars, setLastWeekCountCigars] = useState<number>(0);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [cigarPersons, setCigarPersons] = useState<Record<string, number>[]>(
    []
  );
  const [cigarPlaces, setCigarPlaces] = useState<Record<string, number>[]>([]);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const cigars = await database.getAllAsync<DBCigarWithPlace>(
      `SELECT *, p.name FROM cigars c
        INNER JOIN places p on p.id = c.place_id
      `
    );

    const personCigars = await database.getAllAsync<DBCigarPersonType>(
      `SELECT p.name, cp.cigar_id, cp.person_id, cp.date_time FROM cigar_persons cp
      INNER JOIN persons p on cp.person_id = p.id
      `
    );

    const now = new Date(); // Fecha actual
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Removemos horas, minutos y segundos

    // Obtener el inicio y fin de la semana actual (Lunes - Domingo)
    const dayOfWeek = today.getDay(); // 0 (domingo) - 6 (sábado)
    const startOfWeek = new Date(today); // Copia de la fecha actual
    startOfWeek.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    ); // Lunes de esta semana
    startOfWeek.setHours(0, 0, 0, 0); // Inicio del día

    const endOfWeek = new Date(startOfWeek); // Copia de la fecha de inicio
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo de esta semana
    endOfWeek.setHours(23, 59, 59, 999); // Fin del día

    const actualWeekPersonCigars = filterByDateRange<DBCigarPersonType>(
      personCigars,
      startOfWeek,
      endOfWeek
    );

    const personCigarsCounter = actualWeekPersonCigars.reduce<
      Record<string, number>
    >((acc, item) => {
      if (item.name) {
        acc[item.name] = (acc[item.name] || 0) + 1;
      }
      return acc;
    }, {});

    const personCigarsFormatted = Object.entries(personCigarsCounter).map(
      ([name, count]) => ({ [name]: count })
    );
    setCigarPersons(personCigarsFormatted);

    const actualWeekPlaceCigars = filterByDateRange<DBCigarWithPlace>(
      cigars,
      startOfWeek,
      endOfWeek
    );

    const placeCigarsCounter = actualWeekPlaceCigars.reduce<
      Record<string, number>
    >((acc, item) => {
      if (item.name) {
        acc[item.name] = (acc[item.name] || 0) + 1;
      }
      return acc;
    }, {});

    const placeCigarsFormatted = Object.entries(placeCigarsCounter).map(
      ([name, count]) => ({ [name]: count })
    );
    setCigarPlaces(placeCigarsFormatted);

    const actualWeekCigars = filterCurrentWeek(cigars);
    const lastWeekCigars = filterLastWeek(cigars);

    setActualWeekCountCigars(actualWeekCigars.length);
    setLastWeekCountCigars(lastWeekCigars.length);

    const data = processCigarData(actualWeekCigars);

    setLineChartData(data);
    setDataLoaded(true);
  };

  const processCigarData = (cigars: DBCigarType[]): LineChartData[] => {
    // Inicializar arrays vacíos para cada atributo
    const socialData: LineChartData = { data: [] };
    const emotionalData: LineChartData = { data: [] };
    const conductualData: LineChartData = { data: [] };
    const physiologicalData: LineChartData = { data: [] };

    // Agrupar los datos por fecha
    const groupedByDate: Record<string, DBCigarType[]> = {};

    cigars.forEach((cigar) => {
      const date = cigar.date_time.split("T")[0]; // Extraer solo la fecha YYYY-MM-DD

      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(cigar);
    });

    // Recorrer los datos agrupados por fecha y sumar valores
    Object.values(groupedByDate).forEach((cigarList) => {
      let total = 0;
      let socialSum = 0;
      let emotionalSum = 0;
      let conductualSum = 0;
      let physiologicalSum = 0;

      cigarList.forEach((cigar) => {
        socialSum += cigar.social;
        emotionalSum += cigar.emotional;
        conductualSum += cigar.conductual;
        physiologicalSum += cigar.physiological;
        total +=
          cigar.social +
          cigar.emotional +
          cigar.conductual +
          cigar.physiological;
      });

      const socialPer = (socialSum * 100) / total;
      const emotionalPer = (emotionalSum * 100) / total;
      const conductualPer = (conductualSum * 100) / total;
      const physiologicalPer = (physiologicalSum * 100) / total;

      // Agregar los totales a cada categoría
      socialData.data.push(socialPer);
      emotionalData.data.push(emotionalPer);
      conductualData.data.push(conductualPer);
      physiologicalData.data.push(physiologicalPer);
    });

    // TODO: agregar status bar
    return [
      {
        ...socialData,
        color: (opacity = 0.5) => `rgba(0, 128, 0, ${opacity})`,
      },
      {
        ...emotionalData,
        color: (opacity = 0.5) => `rgba(0, 0, 255, ${opacity})`,
      },
      {
        ...conductualData,
        color: (opacity = 0.5) => `rgba(255, 165, 0, ${opacity})`,
      },
      {
        ...physiologicalData,
        color: (opacity = 0.5) => `rgba(255, 0, 0, ${opacity})`,
      },
    ];
  };

  const filterCurrentWeek = (cigars: DBCigarType[]): DBCigarType[] => {
    const now = new Date(); // Fecha actual
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Removemos horas, minutos y segundos

    // Obtener el inicio y fin de la semana actual (Lunes - Domingo)
    const dayOfWeek = today.getDay(); // 0 (domingo) - 6 (sábado)
    const startOfWeek = new Date(today); // Copia de la fecha actual
    startOfWeek.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    ); // Lunes de esta semana
    startOfWeek.setHours(0, 0, 0, 0); // Inicio del día

    const endOfWeek = new Date(startOfWeek); // Copia de la fecha de inicio
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo de esta semana
    endOfWeek.setHours(23, 59, 59, 999); // Fin del día

    return filterByDateRange(cigars, startOfWeek, endOfWeek);
  };

  const filterLastWeek = (cigars: DBCigarType[]): DBCigarType[] => {
    const now = new Date(); // Fecha actual
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Removemos horas, minutos y segundos

    // Obtener el inicio y fin de la SEMANA ACTUAL (Lunes - Domingo)
    const dayOfWeek = today.getDay(); // 0 (domingo) - 6 (sábado)
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    ); // Lunes de esta semana
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6); // Domingo de esta semana
    endOfCurrentWeek.setHours(23, 59, 59, 999);

    // Calcular inicio y fin de la SEMANA PASADA
    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Lunes de la semana pasada

    const endOfLastWeek = new Date(endOfCurrentWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 7); // Domingo de la semana pasada

    // Filtrar usando filterByDateRange
    return filterByDateRange(cigars, startOfLastWeek, endOfLastWeek);
  };

  const filterByDateRange = <T extends { date_time: string }>(
    data: T[],
    startDate: Date,
    endDate: Date
  ): T[] => {
    // Asegurar que las fechas tengan la hora correctamente establecida
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Inicio del día

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Fin del día

    // Filtrar registros dentro del rango de fechas dado
    return data.filter((item) => {
      const date = new Date(item.date_time);
      return date >= start && date <= end;
    });
  };

  const gradientColors: readonly [string, string, ...string[]] =
    lastWeekCountCigars === actualWeekCountCigars
      ? ["#ffffff", "#f0f0f0"]
      : lastWeekCountCigars > actualWeekCountCigars
        ? ["#d8edd8", "#b5e0b5"]
        : ["#edd8d8", "#e0b5b5"];

  return (
    <Screen style={styles.screen}>
      {dataLoaded ? (
        <ScrollView>
          {/* ESFERAS */}
          {/* TODO: agregar status bar */}
          <View style={{ ...styles.section, backgroundColor: fluorescentCyan(55) }}>
            <View style={styles.chartCardHeader}>
              <SocialIcon size={20} />
              <EmotionalIcon size={20} />
              <ConductualIcon size={20} />
              <PhysiologicalIcon size={20} />
              <Link asChild href="/reviews/spheres">
                <Text style={styles.subtitle}>
                  Esferas <RightShortRow size={15} />
                </Text>
              </Link>
            </View>
            {lineChartData
              .map((item) => item.data.length)
              .reduce((acc, length) => acc + length, 0) > 0 ? (
              <LineChart
                data={{
                  labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
                  datasets: lineChartData,
                }}
                width={Dimensions.get("window").width - 20}
                height={200}
                yAxisSuffix="%"
                yAxisInterval={6}
                chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: fluorescentCyan(10),
                  backgroundGradientTo: fluorescentCyan(55),
                  decimalPlaces: 2,
                  // TODO: agregar status bar
                  color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
                  // TODO: agregar status bar
                  labelColor: (opacity = 1) =>
                    `rgba(100, 100, 100, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                  },
                }}
                bezier
                style={{
                  borderRadius: 16,
                  paddingTop: 10,
                }}
              />
            ) : (
              <Text>No hay datos para mostrar aun</Text>
            )}
          </View>
          {/* CANTIDADES */}
          <LinearGradient
            colors={gradientColors}
            style={{
              ...styles.section,
              backgroundColor:
                lastWeekCountCigars == actualWeekCountCigars
                  ? "white"
                  : lastWeekCountCigars > actualWeekCountCigars
                    ? "#d8edd8"
                    : "#edd8d8",
              marginTop: 10,
              padding: 10,
            }}
          >
            <Link asChild href="/review/count">
              <Text
                style={{
                  ...styles.subtitle,
                  textAlign: "left",
                  color: "black",
                }}
              >
                Cantidad de cigarros <RightShortRow size={15} />
              </Text>
            </Link>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: 5,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f2f0f0",
                  flex: 1,
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    // backgroundColor: "skyblue",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  SEMANA PASADA
                </Text>
                <View
                  style={{
                    backgroundColor: "#d9d9d9",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 5,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {lastWeekCountCigars}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f2f0f0",
                  flex: 1,
                  justifyContent: "space-between",
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#d9d9d9",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 5,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {actualWeekCountCigars}
                  </Text>
                </View>
                <Text
                  style={{
                    // backgroundColor: "skyblue",
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  ESTA SEMANA
                </Text>
              </View>
            </View>
            <Text
              style={{
                textAlign: "center",
                paddingTop: 7,
                fontWeight: "bold",
                color:
                  lastWeekCountCigars == actualWeekCountCigars
                    ? "black"
                    : lastWeekCountCigars > actualWeekCountCigars
                      ? "#32CD32"
                      : "#ff0000",
              }}
            >
              Esta semana has fumado{" "}
              {Math.abs(lastWeekCountCigars - actualWeekCountCigars)} cigarros{" "}
              {lastWeekCountCigars >= actualWeekCountCigars ? "menos" : "más"}
            </Text>
          </LinearGradient>
          {/* PERSONAS Y LUGARES */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              columnGap: 10,
            }}
          >
            {/* PERSONAS */}
            <LinearGradient
              colors={[fluorescentCyan(10), fluorescentCyan(55)]}
              start={{ x: 1, y: 0.866 }}
              end={{ x: 0.5, y: 0 }}
              style={{
                ...styles.section,
                backgroundColor: "white",
                marginTop: 10,
                padding: 15,
                marginRight: 0,
                flex: 1,
                height: 256,
                maxHeight: 256,
              }}
            >
              <Link asChild href="/review/count">
                <Text
                  style={{
                    ...styles.subtitle,
                    textAlign: "center",
                    color: "black",
                    marginBottom: 10,
                  }}
                >
                  <PersonIcon size={20} /> Personas <RightShortRow size={15} />
                </Text>
              </Link>
              <ScrollView>
                {cigarPersons.map((cp, index) => {
                  // Extraer la clave y el valor del objeto
                  const [[name, count]] = Object.entries(cp);

                  return (
                    <View key={index} style={{ paddingVertical: 3 }}>
                      <Text style={{ textAlign: "center" }}>
                        <RightRow size={12} /> {name}: {count} cigarros
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </LinearGradient>
            <LinearGradient
              colors={[fluorescentCyan(10), fluorescentCyan(55)]}
              start={{ x: 0.5, y: 0.866 }}
              end={{ x: 1, y: 0.134 }}
              style={{
                ...styles.section,
                backgroundColor: "white",
                marginTop: 10,
                padding: 15,
                marginLeft: 0,
                flex: 1,
                height: 256,
                maxHeight: 256,
              }}
            >
              <Link asChild href="/review/count">
                <Text
                  style={{
                    ...styles.subtitle,
                    textAlign: "center",
                    color: "black",
                    marginBottom: 10,
                  }}
                >
                  <LocationIcon size={20} /> Lugares <RightShortRow size={15} />
                </Text>
              </Link>
              <ScrollView>
                {cigarPlaces.map((cp, index) => {
                  // Extraer la clave y el valor del objeto
                  const [[name, count]] = Object.entries(cp);

                  return (
                    <View key={index} style={{ paddingVertical: 3 }}>
                      <Text style={{ textAlign: "center" }}>
                        <RightRow size={12} /> {name}: {count} cigarros
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </LinearGradient>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: "80%" }}>
          <ActivityIndicator />
        </View>
      )}
      <CreateCigarButton />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    marginHorizontal: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartCardHeader: {
    width: "100%",
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -5,
    marginTop: 10,
  },
});
