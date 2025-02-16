import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button, Divider } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import Slider from "@react-native-community/slider";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { DBLeaveMotiveType } from "../Types";
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
  description: string;
};

function LeaveMotiveModal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const database = useSQLiteContext();
  const { leave_motive_id } = useLocalSearchParams();
  const leaveMotiveId = leave_motive_id ? Number(leave_motive_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (leave_motive_id) {
        await database.runAsync(
          `UPDATE leave_motives SET name = ?, description = ? WHERE id = ?;`,
          [data.name, data.description, leaveMotiveId]
        );
      } else {
        await database.runAsync(
          `INSERT INTO leave_motives (name, description) 
           VALUES (?, ?);`,
          [data.name, data.description]
        );
      }
      setSubmittedData(data);
      reset();
      router.back();
    } catch (error) {
      console.error("Error al insertar el registro:", error);
    }
  };

  useEffect(() => {
    if (leave_motive_id) {
      const loadLeaveMotive = async () => {
        try {
          const result = await database.getFirstAsync<DBLeaveMotiveType>(
            "SELECT * FROM leave_motives WHERE id = ?",
            [leaveMotiveId]
          );
          if (result) {
            reset({
              id: result.id,
              name: result.name,
              description: result.description,
            });
          }
        } catch (error) {
          console.error("Error cargando el motivo:", error);
        }
      };

      loadLeaveMotive();
    }
  }, [leave_motive_id]);

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

        {/* Campo para la descripcion */}
        <Controller
          control={control}
          name="description"
          rules={{ required: "Debe ingresar una descripcion" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              multiline={true}
              style={{...styles.input, height: 150, textAlignVertical: "top"}}
              placeholder="Descripcion del motivo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {leaveMotiveId ? "Actualizar" : "Crear"} motivo
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

export default LeaveMotiveModal;
