import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button, Divider } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import Slider from "@react-native-community/slider";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { DBMotiveType } from "../Types";
import {
  ConductualIcon,
  EmotionalIcon,
  PhysiologicalIcon,
  SocialIcon,
} from "../Icons";

// Definición de los tipos para los datos del formulario
type FormData = {
  id?: number;
  name: string;
  spheres: {
    social: number;
    emotional: number;
    conductual: number;
    physiological: number;
  };
};

function MotiveModal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const database = useSQLiteContext();
  const { motive_id } = useLocalSearchParams();
  const motiveId = motive_id ? Number(motive_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (motive_id) {
        await database.runAsync(
          `UPDATE motives SET name = ?, social = ?, emotional = ?, conductual = ?, physiological = ? WHERE id = ?;`,
          [
            data.name,
            data.spheres.social,
            data.spheres.emotional,
            data.spheres.conductual,
            data.spheres.physiological,
            motiveId,
          ]
        );
      } else {
        await database.runAsync(
          `INSERT INTO motives (name, social, emotional, conductual, physiological) 
           VALUES (?, ?, ?, ?, ?);`,
          [
            data.name,
            data.spheres.social,
            data.spheres.emotional,
            data.spheres.conductual,
            data.spheres.physiological,
          ]
        );
      }
      setSubmittedData(data);
      reset();
      router.back();
    } catch (error) {
      console.error("Error al insertar el registro:", error);
    }
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

  useEffect(() => {
    console.log(motive_id);
    if (motive_id) {
      const loadMotive = async () => {
        try {
          const result = await database.getFirstAsync<DBMotiveType>(
            "SELECT * FROM motives WHERE id = ?",
            [motiveId]
          );
          if (result) {
            reset({
              id: result.id,
              name: result.name,
              spheres: {
                social: result.social,
                emotional: result.emotional,
                conductual: result.conductual,
                physiological: result.physiological,
              },
            });
            setSpheres({
              social: result.social,
              emotional: result.emotional,
              conductual: result.conductual,
              physiological: result.physiological,
            });
          }
        } catch (error) {
          console.error("Error cargando el motivo:", error);
        }
      };

      loadMotive();
    }
  }, [motive_id]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Campo para el nombre */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "Debe ingresar un nombre" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nombre del motivo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Divider />
        <Text style={styles.title}>Esferas</Text>
        <Controller
          control={control}
          name="spheres"
          rules={{
            validate: (value) =>
              Object.values(value).reduce((acc, curr) => acc + curr, 0) ===
                100 || "La suma de las esferas debe ser igual a 100%",
          }}
          render={({ field: { onChange } }) => (
            <>
              {/* Barra de intensidad 1 */}
              <Text>
                <SocialIcon size={20} />  Social: {spheres.social}%
              </Text>
              <Slider
                value={spheres.social}
                onValueChange={(value) => {
                  handleSpheresChange(value, "social", onChange);
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 2 */}
              <Text>
                <EmotionalIcon size={20} />  Emocional: {spheres.emotional}%
              </Text>
              <Slider
                value={spheres.emotional}
                onValueChange={(value) => {
                  handleSpheresChange(value, "emotional", onChange);
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 3 */}
              <Text>
                <ConductualIcon size={20} />  Conductual: {spheres.conductual}%
              </Text>
              <Slider
                value={spheres.conductual}
                onValueChange={(value) => {
                  handleSpheresChange(value, "conductual", onChange);
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 4 */}
              <Text>
                <PhysiologicalIcon size={20} />  Physiological: {spheres.physiological}%
              </Text>
              <Slider 
                value={spheres.physiological}
                onValueChange={(value) => {
                  handleSpheresChange(value, "physiological", onChange);
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />
            </>
          )}
        />
        {errors.spheres && (
          <Text style={styles.errorText}>{errors.spheres.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {motiveId ? "Actualizar" : "Crear"} motivo
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
});

export default MotiveModal;
