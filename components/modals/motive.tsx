import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Definición de los tipos para los datos del formulario
type FormData = {
  name: string;
  email: string;
};

function MyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Submitted Data:", data);
    setSubmittedData(data);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Campo para el nombre */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "You must enter your name" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        {/* Campo para el email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "You must enter your email",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />

        {/* Mostrar los datos enviados */}
        {submittedData && (
          <View style={styles.submittedContainer}>
            <Text style={styles.submittedTitle}>Submitted Data:</Text>
            <Text>Name: {submittedData.name}</Text>
            <Text>Email: {submittedData.email}</Text>
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
    color: "red",
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
});

export default MyForm;
