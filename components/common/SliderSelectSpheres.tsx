import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Text } from "react-native-paper";
import {
  ConductualIcon,
  EmotionalIcon,
  PhysiologicalIcon,
  SocialIcon,
} from "../Icons";
import Slider from "@react-native-community/slider";
import { fireBrick, marianBlue } from "../../assets/palette";
import { StyleSheet } from "react-native";
import { CigarFormData, MotiveFormData, Spheres } from "../Types";

type CommonFormData = {
  id?: number;
  date_time: string;
  spheres: Spheres;
} & Partial<MotiveFormData> &
  Partial<CigarFormData>;

type SliderSelectSpheresProps = {
  initialized?: boolean;
  control: Control<CommonFormData, any>;
  spheres: Spheres;
  handleSpheresChange: (
    value: number,
    sphere: "social" | "emotional" | "conductual" | "physiological",
    onChange: (value: any) => void
  ) => void;
};

export default function SliderSelectSpheres({
  initialized = false,
  control,
  spheres,
  handleSpheresChange,
}: SliderSelectSpheresProps) {
  const [auxSpheres, setAuxSpheres] = useState<Spheres>(spheres);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [auxInitialized, setInitialized] = useState(initialized);

  const auxHandleSphereChanges = (
    value: number,
    sphere: "social" | "emotional" | "conductual" | "physiological",
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
      setAuxSpheres(auxSpheres);
      handleSpheresChange(value, sphere, onChange);
    }, 150);

    setTimeoutId(id);
  };

  useEffect(() => {
    if (!auxInitialized) {
      setInitialized(true);
    }
  }, [spheres]);
  
  useEffect(() => {
    setAuxSpheres(spheres);
  }, [auxInitialized, initialized, spheres])

  return (
    <Controller
      control={control}
      name="spheres"
      rules={{
        validate: (value) =>
          Object.values(value).reduce((acc, curr) => acc + curr, 0) === 100 ||
          "La suma de las esferas debe ser igual a 100%",
      }}
      render={({ field: { onChange } }) => (
        <>
          {/* Barra de intensidad 1 */}
          <Text>
            <SocialIcon size={20} /> Social: {auxSpheres.social}%
          </Text>
          <Slider
            value={auxSpheres.social}
            onValueChange={(value) => {
              auxHandleSphereChanges(value, "social", onChange);
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
          />

          {/* Barra de intensidad 2 */}
          <Text>
            <EmotionalIcon size={20} /> Emocional: {auxSpheres.emotional}%
          </Text>
          <Slider
            value={auxSpheres.emotional}
            onValueChange={(value) => {
              auxHandleSphereChanges(value, "emotional", onChange);
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
          />

          {/* Barra de intensidad 3 */}
          <Text>
            <ConductualIcon size={20} /> Conductual: {auxSpheres.conductual}%
          </Text>
          <Slider
            value={auxSpheres.conductual}
            onValueChange={(value) => {
              auxHandleSphereChanges(value, "conductual", onChange);
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
          />

          {/* Barra de intensidad 4 */}
          <Text>
            <PhysiologicalIcon size={20} /> Physiological:{" "}
            {auxSpheres.physiological}%
          </Text>
          <Slider
            value={auxSpheres.physiological}
            onValueChange={(value) => {
              auxHandleSphereChanges(value, "physiological", onChange);
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
          />
        </>
      )}
    />
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
