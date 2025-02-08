import React, { useEffect } from "react";
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
  } & Partial<MotiveFormData> & Partial<CigarFormData>;

type SliderSelectSpheresProps = {
  control: Control<CommonFormData, any>;
  spheres: Spheres;
  handleSpheresChange: (
    value: number,
    sphere: "social" | "emotional" | "conductual" | "physiological",
    onChange: (value: any) => void
  ) => void;
};

export default function SliderSelectSpheres({
  control,
  spheres,
  handleSpheresChange,
}: SliderSelectSpheresProps) {
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
            <SocialIcon size={20} /> Social: {spheres.social}%
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
            <EmotionalIcon size={20} /> Emocional: {spheres.emotional}%
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
            <ConductualIcon size={20} /> Conductual: {spheres.conductual}%
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
            <PhysiologicalIcon size={20} /> Physiological:{" "}
            {spheres.physiological}%
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
