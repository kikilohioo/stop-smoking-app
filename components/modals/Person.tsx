import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { DBPersonType } from "../Types";

// Definición de los tipos para los datos del formulario
type FormData = {
  id?: number;
  name: string;
};

function PersonModal() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const database = useSQLiteContext();
  const { person_id } = useLocalSearchParams();
  const personId = person_id ? Number(person_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (person_id) {
        await database.runAsync(`UPDATE persons SET name = ?;`, [
          data.name,
          personId,
        ]);
      } else {
        await database.runAsync(
          `INSERT INTO persons (name) 
           VALUES (?);`,
          [data.name]
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
    if (person_id) {
      const loadPerson = async () => {
        try {
          const result = await database.getFirstAsync<DBPersonType>(
            "SELECT * FROM persons WHERE id = ?",
            [personId]
          );
          if (result) {
            reset({
              id: result.id,
              name: result.name,
            });
          }
        } catch (error) {
          console.error("Error cargando el motivo:", error);
        }
      };

      loadPerson();
    }
  }, [person_id]);

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
              placeholder="Nombre de la persona"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {personId ? "Actualizar" : "Crear"} persona
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

export default PersonModal;
