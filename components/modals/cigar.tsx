import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  CigarFormData,
  DBCigarType,
  DBMotiveType,
  MotiveFormData,
  Spheres,
} from "../Types";
import DateTimePicker from "../common/DateTimePicker";
import SliderSelectSpheres from "../common/SliderSelectSpheres";
import { SelectList } from "react-native-dropdown-select-list";

// Definición de los tipos para los datos del formulario
type FormData = {
  id?: number;
  date_time: string;
  spheres: Spheres;
} & Partial<MotiveFormData> &
  Partial<CigarFormData>;

type AuxMotive = {
  key: number;
  value: string;
  social: number;
  emotional: number;
  conductual: number;
  physiological: number;
};

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
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [showSpheres, setShowSpheres] = useState<boolean>(false);
  const [motives, setMotives] = useState<AuxMotive[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [spheres, setSpheres] = useState<{
    social: number;
    emotional: number;
    conductual: number;
    physiological: number;
  }>({
    social: 0,
    emotional: 0,
    conductual: 0,
    physiological: 0,
  });

  const handleDateTimePickerChange = (value: Date) => {
    setDateTime(value);
  };

  const handleSpheresChange = (
    value: number,
    sphere: keyof typeof spheres,
    onChange: (value: any) => void
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Limpiar cualquier retardo anterior
    }

    const id = setTimeout(() => {
      let auxSpheres = { ...spheres, [sphere]: 0 };
      const auxTotal = Object.values(auxSpheres).reduce(
        (acc, curr) => acc + curr,
        0
      );

      if (auxTotal + value > 100) {
        let allowedMaxValues = 100 - auxTotal;
        auxSpheres = {
          ...auxSpheres,
          [sphere]: allowedMaxValues,
        };
      } else {
        auxSpheres = {
          ...auxSpheres,
          [sphere]: value,
        };
      }
      setSpheres(auxSpheres);
      onChange(auxSpheres);
    }, 300);

    setTimeoutId(id);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log(data);
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

  const loadData = async () => {
    const motives = await database.getAllAsync<AuxMotive>(
      "SELECT id as key, name as value, social, emotional, conductual, physiological FROM motives"
    );
    console.log(motives);
    setMotives(motives);
  };

  const handleMotiveChange = (
    value: number,
    onChange: (value: any) => void
  ) => {
    const foundMotive = motives.find((motive) => motive.key === value);
  
    if (foundMotive) {
      const { social, emotional, conductual, physiological } = foundMotive;
      setSpheres({ social, emotional, conductual, physiological });
    } else {
      console.warn("Motive not found for key:", value);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <DateTimePicker
          control={control}
          handleDateTimePickerChange={handleDateTimePickerChange}
          dateTime={dateTime}
        />
        {errors.date_time && (
          <Text style={styles.errorText}>{errors.date_time.message}</Text>
        )}
        <Controller
          control={control}
          name="motive_id"
          rules={{ required: "Debe seleccionar un motivo" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectList
              setSelected={(val: string) =>
                onChange(motives.find((motive) => motive.value == val)?.key)
              }
              data={motives}
              save="value"
            />
          )}
        />
        {/* ESFERAS */}
        <Button
          onPress={() => setShowSpheres(!showSpheres)}
          textColor={showSpheres ? fireBrick(40) : marianBlue(50)}
        >
          {showSpheres ? "Ocultar esferas" : "Mostrar esferas"}
        </Button>
        {showSpheres && (
          <SliderSelectSpheres
            spheres={spheres}
            control={control}
            handleSpheresChange={handleSpheresChange}
          />
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
  button: {
    backgroundColor: marianBlue(50),
  },
});

export default CigarModal;
