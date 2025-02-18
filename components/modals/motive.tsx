import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button, Divider } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { CigarFormData, DBMotiveType, MotiveFormData, Spheres } from "../Types";
import SliderSelectSpheres from "../common/SliderSelectSpheres";

type FormData = {
  id?: number;
  date_time: string;
  spheres: Spheres;
} & Partial<MotiveFormData> &
  Partial<CigarFormData>;

function MotiveModal() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const database = useSQLiteContext();
  const { motive_id } = useLocalSearchParams();
  const motiveId = motive_id ? Number(motive_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
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
            data?.name ? data.name : "",
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
            data?.name ? data.name : "",
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
  };

  useEffect(() => {
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
        {(motive_id == undefined ||
          Object.values(spheres).reduce((acc, curr) => acc + curr, 0) > 0) && (
          <SliderSelectSpheres
            spheres={spheres}
            control={control}
            handleSpheresChange={(value, sphere, onChange) => {
              const formSpheres = getValues().spheres;
              if (formSpheres !== undefined && formSpheres[sphere] == value) {
                return;
              }
              handleSpheresChange(value, sphere, onChange);
            }}
          />
        )}
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
