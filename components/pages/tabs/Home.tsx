import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { Screen } from "../../Screen";
import { DBCigarType } from "../../Types";
import { BarChart, LineChart } from "react-native-chart-kit";
import { fireBrick, fluorescentCyan, marianBlue, teal } from "../../../assets/palette";
import { Link, useFocusEffect } from "expo-router";
import { ConductualIcon, EmotionalIcon, PhysiologicalIcon, RightShortRow, SocialIcon } from "../../Icons";
import CreateCigarButton from "../../common/CreateCigarButton";

// const screenWidth = Dimensions.get("window").width;
type LineChartData = {
  data: number[],
  color?: () => string
}

export function HomePage() {
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
  const [actualWeekCountCigars, setActualWeekCountCigars] = useState<number>(0);
  const [lastWeekCountCigars, setLastWeekCountCigars] = useState<number>(0);
  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  const loadData = async () => {
    const cigars = await database.getAllAsync<DBCigarType>(
      "SELECT * FROM cigars"
    );

    const actualWeekCigars = filterCurrentWeek(cigars);
    const lastWeekCigars = filterLastWeek(cigars);

    setActualWeekCountCigars(actualWeekCigars.length)
    setLastWeekCountCigars(lastWeekCigars.length)

    const data = processCigarData(actualWeekCigars);
    setLineChartData(data);
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
        total += cigar.social + cigar.emotional + cigar.conductual + cigar.physiological;
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

    return [{ ...socialData, color: (opacity = 0.5) => `rgba(0, 128, 0, ${opacity})` }, { ...emotionalData, color: (opacity = 0.5) => `rgba(0, 0, 255, ${opacity})` }, { ...conductualData, color: (opacity = 0.5) => `rgba(255, 165, 0, ${opacity})` }, { ...physiologicalData, color: (opacity = 0.5) => `rgba(255, 0, 0, ${opacity})` }];
  }

  const filterCurrentWeek = (cigars: DBCigarType[]): DBCigarType[] => {
    const now = new Date(); // Fecha actual
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Removemos horas, minutos y segundos

    // Obtener el inicio y fin de la semana actual (Lunes - Domingo)
    const dayOfWeek = today.getDay(); // 0 (domingo) - 6 (sábado)
    const startOfWeek = new Date(today); // Copia de la fecha actual
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Lunes de esta semana
    startOfWeek.setHours(0, 0, 0, 0); // Inicio del día

    const endOfWeek = new Date(startOfWeek); // Copia de la fecha de inicio
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo de esta semana
    endOfWeek.setHours(23, 59, 59, 999); // Fin del día

    return filterByDateRange(cigars, startOfWeek, endOfWeek);
  }

  const filterLastWeek = (cigars: DBCigarType[]): DBCigarType[] => {
    const now = new Date(); // Fecha actual
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Removemos horas, minutos y segundos

    // Obtener el inicio y fin de la SEMANA ACTUAL (Lunes - Domingo)
    const dayOfWeek = today.getDay(); // 0 (domingo) - 6 (sábado)
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Lunes de esta semana
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

  const filterByDateRange = (
    cigars: DBCigarType[],
    startDate: Date,
    endDate: Date
  ): DBCigarType[] => {
    // Asegurar que las fechas tengan la hora correctamente establecida
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Inicio del día

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Fin del día

    // Filtrar registros dentro del rango de fechas dado
    return cigars.filter((cigar) => {
      const date = new Date(cigar.date_time);
      return date >= start && date <= end;
    });
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <View style={{ ...styles.section, backgroundColor: marianBlue(70) }}>
          <View style={styles.chartCardHeader}>
            <SocialIcon size={20} />
            <EmotionalIcon size={20} />
            <ConductualIcon size={20} />
            <PhysiologicalIcon size={20} />
            <Link asChild href="/reviews/spheres">
              <Text style={styles.subtitle}>Esferas <RightShortRow size={15} /></Text>
            </Link>
          </View>
          {
            lineChartData.length > 0
              ?
              <LineChart
                data={{
                  labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
                  datasets: lineChartData
                }}
                width={Dimensions.get("window").width - 20} // from react-native
                height={200}
                // yAxisLabel="$"
                yAxisSuffix="%"
                yAxisInterval={6} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: fluorescentCyan(80),
                  backgroundGradientTo: marianBlue(70),
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                  }
                }}
                bezier
                style={{
                  borderRadius: 16,
                  paddingTop: 10,
                }}
              />
              :
              <Text>No hay datos para mostrar aun</Text>
          }
        </View>
        <View style={{ ...styles.section, backgroundColor: "white", marginTop: 10, padding: 10 }}>
          <Link asChild href="/review/count">
            <Text style={{ ...styles.subtitle, textAlign: "left", color: "black" }}>Cantidad de cigarros <RightShortRow size={15} color="black" /></Text>
          </Link>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "red" }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "green", flex: 1, justifyContent: "space-between" }}>
              <Text style={{backgroundColor: "skyblue", flex: 1, textAlign: "center"}}>Semana pasada</Text>
              <View style={{ backgroundColor: "grey", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5 }}>
                <Text>{lastWeekCountCigars}</Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "blue", flex: 1, justifyContent: "space-between" }}>
              <View style={{ backgroundColor: "grey", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5 }}>
                <Text>{actualWeekCountCigars}</Text>
              </View>
              <Text style={{backgroundColor: "skyblue", flex: 1, textAlign: "center"}}>Esta semana</Text>
            </View>
          </View>
          <Text>Esta semana has fumado {lastWeekCountCigars - actualWeekCountCigars} cigarros menos</Text>
        </View>
      </ScrollView>
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
    color: "white",
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
  }
});