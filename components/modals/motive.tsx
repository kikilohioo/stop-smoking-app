import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { Button, Divider } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import Slider from "@react-native-community/slider";

// Definición de los tipos para los datos del formulario
type FormData = {
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
  } = useForm<FormData>();
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Submitted Data:", data);
    // setSubmittedData(data);
  };

  const handleSpheresChange = (value: number, sphere: keyof typeof spheres) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Limpiar cualquier retardo anterior
    }

    const id = setTimeout(() => {
      // Calcular la suma de los valores de todas las esferas
      const total = Object.values(spheres).reduce((acc, curr) => acc + curr, 0);
      const diff = value - spheres[sphere]; // Diferencia entre el nuevo valor y el valor anterior

      if (total + diff <= 100) {
        setSpheres((prevSpheres) => ({
          ...prevSpheres,
          [sphere]: value,
        }));
      }
    }, 300); // 300 ms de retardo

    setTimeoutId(id);
  };

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
          rules={{ required: "La suma de las esferas debe ser de 100%" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              {/* Barra de intensidad 1 */}
              <Text>Social: {spheres.social}%</Text>
              <Slider
                value={spheres.social}
                onValueChange={(value) => handleSpheresChange(value, "social")}
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 2 */}
              <Text>Emocional: {spheres.emotional}%</Text>
              <Slider
                value={spheres.emotional}
                onValueChange={(value) =>
                  handleSpheresChange(value, "emotional")
                }
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 2 */}
              <Text>Conductual: {spheres.conductual}%</Text>
              <Slider
                value={spheres.conductual}
                onValueChange={(value) =>
                  handleSpheresChange(value, "conductual")
                }
                minimumValue={0}
                maximumValue={100}
                step={1}
                style={styles.slider}
              />

              {/* Barra de intensidad 2 */}
              <Text>Fisiologico: {spheres.physiological}%</Text>
              <Slider
                value={spheres.physiological}
                onValueChange={(value) =>
                  handleSpheresChange(value, "physiological")
                }
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
          Crear nuevo motivo
        </Button>

        {/* Mostrar los datos enviados */}
        {submittedData && (
          <View style={styles.submittedContainer}>
            <Text style={styles.submittedTitle}>Submitted Data:</Text>
            <Text>Name: {submittedData.name}</Text>
          </View>
        )}
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
