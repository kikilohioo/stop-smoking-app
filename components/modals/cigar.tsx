import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { CigarFormData, DBCigarType, MotiveFormData, Spheres } from "../Types";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// Definición de los tipos para los datos del formulario
type FormData = {
  id?: number;
  spheres: Spheres;
} & Partial<MotiveFormData> &
  Partial<CigarFormData>;

function CigarModal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const database = useSQLiteContext();
  const { cigar_id } = useLocalSearchParams();
  const cigarId = cigar_id ? Number(cigar_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const toggleShowDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleShowTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const handleDateChange = (
    { type }: DateTimePickerEvent,
    selectedValue: Date | undefined
  ) => {
    if (type == "set") {
      const currentValue = selectedValue;
      setDate(currentValue ?? date);
    } else {
      toggleShowDatePicker();
    }
  };

  const handleTimeChange = (
    { type }: DateTimePickerEvent,
    selectedValue: Date | undefined
  ) => {
    if (type == "set") {
      const currentValue = selectedValue;
      setTime(currentValue ?? time);
    } else {
      toggleShowTimePicker();
    }
  };

  const formatDate = (
    format: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "DD/MM/YYYY"
  ): string => {
    const year = String(date.getFullYear()); // Convertir a string explícitamente
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return format.replace(/YYYY|MM|DD/g, (match: string): string => {
      switch (match) {
        case "YYYY":
          return year;
        case "MM":
          return month;
        case "DD":
          return day;
        default:
          return match;
      }
    });
  };

  const formatTime = (
    format: "HH:MM:SS.mmm" | "HH:MM:SS" | "HH:MM"
  ): string => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const milliseconds = String(time.getMilliseconds()).padStart(3, "0");

    return format.replace(/HH|MM|SS|mmm/g, (match: string): string => {
      switch (match) {
        case "HH":
          return hours;
        case "MM":
          return minutes;
        case "SS":
          return seconds;
        case "mmm":
          return milliseconds;
        default:
          return match;
      }
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log(data)
      // if (cigar_id) {
      //   // Actualizar un registro existente
      //   await database.runAsync(
      //     `UPDATE cigars 
      //      SET intensity = ?, motive_id = ?, social = ?, emotional = ?, 
      //          conductual = ?, physiological = ?, trigger_id = ?, 
      //          place_id = ?, person_id = ?, date_time = ?
      //      WHERE id = ?;`,
      //     [
      //       data.intensity ?? 0,
      //       data.motive_id ?? 0,
      //       data.spheres.social ?? 0,
      //       data.spheres.emotional ?? 0,
      //       data.spheres.conductual ?? 0,
      //       data.spheres.physiological ?? 0,
      //       data.trigger_id ?? 0,
      //       data.place_id ?? 0,
      //       data.person_id ?? 0,
      //       data.date_time ?? "NOW()",
      //       cigarId, // ID del cigarro que se actualiza
      //     ]
      //   );
      // } else {
      //   // Insertar un nuevo registro
      //   await database.runAsync(
      //     `INSERT INTO cigars (intensity, motive_id, social, emotional, 
      //                          conductual, physiological, trigger_id, 
      //                          place_id, person_id, date_time) 
      //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      //     [
      //       data.intensity ?? 0,
      //       data.motive_id ?? 0,
      //       data.spheres.social ?? 0,
      //       data.spheres.emotional ?? 0,
      //       data.spheres.conductual ?? 0,
      //       data.spheres.physiological ?? 0,
      //       data.trigger_id ?? 0,
      //       data.place_id ?? 0,
      //       data.person_id ?? 0,
      //       data.date_time ?? "NOW()",
      //     ]
      //   );
      // }
      // setSubmittedData(data);
      // reset();
      // router.back();
    } catch (error) {
      console.error("Error al insertar o actualizar el registro:", error);
    }
  };

  useEffect(() => {
    console.log(cigar_id);
    if (cigar_id) {
      const loadCigar = async () => {
        try {
          const result = await database.getFirstAsync<DBCigarType>(
            "SELECT * FROM cigars WHERE id = ?",
            [cigarId]
          );
          if (result) {
            reset({
              id: result.id,
              // name: result.name,
            });
          }
        } catch (error) {
          console.error("Error cargando el motivo:", error);
        }
      };

      loadCigar();
    }
  }, [cigar_id]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Controller
          control={control}
          name="date_time"
          rules={{ required: "Debe seleccionar una fecha y hora" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.dateTimePicker}>
              <Text style={styles.datePickerLabel}>Fecha y Hora</Text>
              <TextInput
                style={{ ...styles.input, flex: 2}}
                placeholder="Fecha y hora"
                onBlur={onBlur}
                onChange={onChange}
                onPress={toggleShowDatePicker}
                value={value}
              />
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={handleDateChange}
                />
              )}
              <TextInput
                style={{ ...styles.input, marginLeft: 5, flex: 1 }}
                placeholder="Fecha y hora"
                onBlur={onBlur}
                onChangeText={onChange}
                onPress={toggleShowTimePicker}
                value={formatTime("HH:MM:SS")}
              />
              {showTimePicker && (
                <DateTimePicker
                  mode="time"
                  display="spinner"
                  value={time}
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}
        />
        {errors.date_time && (
          <Text style={styles.errorText}>{errors.date_time.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {cigarId ? "Actualizar" : "Anotar"} cigarro
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: fireBrick(60),
    marginBottom: 10,
  },
  submittedContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  submittedTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  slider: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: marianBlue(50),
  },
  dateTimePicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerLabel: {
    paddingBottom: 10,
    marginRight: 10,
  },
});

export default CigarModal;
