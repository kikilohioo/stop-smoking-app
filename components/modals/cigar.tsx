import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { fireBrick, marianBlue } from "../../assets/palette";
import { useSQLiteContext } from "expo-sqlite";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  CigarFormData,
  DBCigarPersonType,
  DBCigarType,
  MotiveFormData,
  Spheres,
} from "../Types";
import DateTimePicker from "../common/DateTimePicker";
import SliderSelectSpheres from "../common/SliderSelectSpheres";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import Slider from "@react-native-community/slider";

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

type AuxTrigger = {
  key: number;
  value: string;
};

type AuxPerson = {
  key: number;
  value: string;
};

type SelectAuxPerson = {
  key: any;
  value: any;
};

type AuxPlace = {
  key: number;
  value: string;
};

type DBCigarPersonAuxType = DBCigarPersonType & { name: string };

function CigarModal() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      date_time: dateTime.toISOString(),
      spheres: { social: 0, emotional: 0, conductual: 0, physiological: 0 },
      intensity: 5,
    },
  });

  const database = useSQLiteContext();
  const { cigar_id } = useLocalSearchParams();
  const cigarId = cigar_id ? Number(cigar_id) : false;

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [showSpheres, setShowSpheres] = useState<boolean>(false);
  // estados de combos de seleccion
  const [selectedMotive, setSelectedMotive] = useState<string>("");
  const [selectedTrigger, setSelectedTrigger] = useState<string>("");
  const [selectedPersons, setSelectedPersons] = useState<
    (string | undefined)[]
  >([]);
  const [selectedPlace, setSelectedPlace] = useState<string>("");
  // datos de otras tablas
  const [motives, setMotives] = useState<AuxMotive[]>([]);
  const [triggers, setTriggers] = useState<AuxTrigger[]>([]);
  const [persons, setPersons] = useState<AuxPerson[]>([]);
  const [places, setPlaces] = useState<AuxPlace[]>([]);
  // otros
  const [intensity, setIntensity] = useState<number>(5);
  const [rechargeSpheres, setRechargeSpheres] = useState<boolean>(false);
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

  const handleDateTimePickerChange = (
    value: Date,
    strValue: string,
    onChange: (value: any) => void
  ) => {
    setDateTime(value);
    onChange(strValue);
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (cigar_id) {
        // Actualizar un registro existente
        await database.runAsync(
          `UPDATE cigars
           SET intensity = ?, motive_id = ?, social = ?, emotional = ?,
               conductual = ?, physiological = ?, trigger_id = ?,
               place_id = ?, date_time = ?
           WHERE id = ?;`,
          [
            data.intensity ?? 5,
            data.motive_id ?? 0,
            data.spheres.social ?? 0,
            data.spheres.emotional ?? 0,
            data.spheres.conductual ?? 0,
            data.spheres.physiological ?? 0,
            data.trigger_id ?? 0,
            data.place_id ?? 0,
            data.date_time ?? "NOW()",
            cigarId, // ID del cigarro que se actualiza
          ]
        );

        await database.runAsync(
          "DELETE FROM cigar_persons where cigar_id = ?",
          cigarId
        );

        const { persons } = data;

        if (persons && persons.length > 0) {
          // Suponiendo que 'persons' es un array de strings y la tabla tiene una columna 'name'
          const values = persons
            .map(
              (value) => `(${cigarId}, ${value.toString().replace(/'/g, "''")}, ${data.date_time ?? "NOW()"})`
            )
            .join(", ");

          const insertSql = `INSERT INTO cigar_persons (cigar_id, person_id, date_time) VALUES ${values};`;
          await database.runAsync(insertSql);
        }
      } else {
        // Insertar un nuevo registro
        let statement = await database.prepareAsync(
          `INSERT INTO cigars (intensity, motive_id, social, emotional,
                               conductual, physiological, trigger_id,
                               place_id, date_time)
           VALUES ($intensity, $motive_id, $social, $emotional,
                               $conductual, $physiological, $trigger_id,
                               $place_id, $date_time);`
        );

        let result = await statement.executeAsync({
          $intensity: data.intensity ?? 0,
          $motive_id: data.motive_id ?? 0,
          $social: data.spheres.social ?? 0,
          $emotional: data.spheres.emotional ?? 0,
          $conductual: data.spheres.conductual ?? 0,
          $physiological: data.spheres.physiological ?? 0,
          $trigger_id: data.trigger_id ?? "NULL",
          $place_id: data.place_id ?? 0,
          $date_time: data.date_time ?? "NOW()",
        });

        let newCigarId = result.lastInsertRowId;

        const { persons } = data;
        console.log(data.date_time);

        if (persons && persons.length > 0) {
          const values = persons
            .map(
              (value) =>
                `(${newCigarId}, ${value.toString().replace(/'/g, "''")}, '${data.date_time ?? "NOW()"}')`
            )
            .join(", ");

          const insertSql = `INSERT INTO cigar_persons (cigar_id, person_id, date_time) VALUES ${values};`;
          await database.runAsync(insertSql);
        }
      }
      setSubmittedData(data);
      reset();
      router.back();
    } catch (error) {
      console.error("Error al insertar o actualizar el registro:", error);
    }
  };

  useEffect(() => {
    if (cigar_id) {
      const loadCigar = async () => {
        try {
          const result = await database.getFirstAsync<DBCigarType>(
            "SELECT * FROM cigars WHERE id = ?",
            [cigarId]
          );

          const cigarPersonsResult =
            await database.getAllAsync<DBCigarPersonAuxType>(
              `SELECT p.name, cp.cigar_id, cp.person_id, cp.id  FROM cigar_persons cp
                INNER JOIN persons p on cp.person_id = p.id
                WHERE cigar_id = ?`,
              [cigarId]
            );

          if (result) {
            reset({
              id: result.id,
              date_time: result.date_time, // Asegúrate de que date_time esté bien formateado
              intensity: result.intensity,
              motive_id: result.motive_id,
              trigger_id: result.trigger_id,
              place_id: result.place_id,
              spheres: {
                social: result.social,
                emotional: result.emotional,
                conductual: result.conductual,
                physiological: result.physiological,
              },
              persons: cigarPersonsResult.map((cp) => cp.person_id),
            });

            setDateTime(new Date(result.date_time)); // Ajusta el estado del datetime picker
            setSpheres({
              social: result.social,
              emotional: result.emotional,
              conductual: result.conductual,
              physiological: result.physiological,
            });

            setSelectedMotive(result.motive_id.toString());
            setSelectedTrigger(
              result.trigger_id ? result.trigger_id.toString() : ""
            );

            setSelectedPersons(
              cigarPersonsResult !== null
                ? cigarPersonsResult.map((cp) => cp.name)
                : []
            );
            setSelectedPlace(result.place_id.toString());
            setIntensity(result.intensity);
          }
        } catch (error) {
          console.error("Error cargando el cigarro:", error);
        }
      };

      loadCigar();
    }
  }, [cigar_id]);

  const loadData = async () => {
    const motives = await database.getAllAsync<AuxMotive>(
      "SELECT id as key, name as value, social, emotional, conductual, physiological FROM motives"
    );
    const triggers = await database.getAllAsync<AuxMotive>(
      "SELECT id as key, name as value FROM triggers"
    );
    const persons = await database.getAllAsync<AuxMotive>(
      "SELECT id as key, name as value FROM persons"
    );
    const places = await database.getAllAsync<AuxMotive>(
      "SELECT id as key, name as value FROM places"
    );
    setMotives(motives);
    setTriggers(triggers);
    setPersons(persons);
    setPlaces(places);
  };

  const handleMotiveChange = (
    value: string,
    onChange: (value: any) => void
  ) => {
    setRechargeSpheres(true);
    const auxMotiveId = motives.find((motive) => motive.value == value)?.key;
    const foundMotive = motives.find((motive) => motive.key === auxMotiveId);
    if (foundMotive) {
      const { social, emotional, conductual, physiological } = foundMotive;
      setSpheres({ social, emotional, conductual, physiological });
      setValue("spheres", { social, emotional, conductual, physiological });
      onChange(auxMotiveId);
    } else {
      console.warn("Motive not found for key:", value);
    }
    setRechargeSpheres(false);
  };

  const handleTriggerChange = (
    value: string,
    onChange: (value: any) => void
  ) => {
    const auxTriggerId = triggers.find(
      (trigger) => trigger.value == value
    )?.key;
    const foundTrigger = triggers.find(
      (trigger) => trigger.key === auxTriggerId
    );
    if (foundTrigger) {
      onChange(auxTriggerId);
    } else {
      console.warn("Trigger not found for key:", value);
    }
  };

  const handlePersonChange = (
    values: (string | undefined)[],
    onChange: (value: any) => void
  ) => {
    const auxPersonsId = persons
      .filter((person) => values.find((v) => v == person.value))
      ?.map((person) => person.key);
    if (auxPersonsId.length == values.length) {
      onChange(auxPersonsId);
    } else {
      console.warn("Person not found for key:", values);
    }
  };

  const handlePlaceChange = (value: string, onChange: (value: any) => void) => {
    const auxPlaceId = places.find((places) => places.value == value)?.key;
    const foundPlace = places.find((places) => places.key === auxPlaceId);
    if (foundPlace) {
      onChange(auxPlaceId);
    } else {
      console.warn("Place not found for key:", value);
    }
  };

  const handleIntensityChange = (
    value: number,
    onChange: (value: any) => void
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Limpiar cualquier retardo anterior
    }

    const id = setTimeout(() => {
      onChange(value);
    }, 300);

    setTimeoutId(id);
  };

  useFocusEffect(
    useCallback(() => {
      loadData(); // Fetch data when the screen is focused
    }, [])
  );

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <DateTimePicker
          control={control}
          handleDateTimePickerChange={handleDateTimePickerChange}
          dateTime={dateTime}
          disabled={cigar_id ? true : false}
        />
        {errors.date_time && (
          <Text style={styles.errorText}>{errors.date_time.message}</Text>
        )}
        <Controller
          control={control}
          name="motive_id"
          rules={{ required: "Debe seleccionar un motivo" }}
          render={({ field: { onChange } }) => (
            <>
              <Text style={{ marginBottom: 5 }}>Motivo</Text>
              <SelectList
                defaultOption={motives.find(
                  (motive) => motive.key.toString() == selectedMotive
                )}
                placeholder="Seleccione un motivo"
                onSelect={() => {
                  handleMotiveChange(selectedMotive, onChange);
                }}
                setSelected={(val: string) => {
                  setSelectedMotive(val);
                }}
                data={motives}
                save="value"
              />
            </>
          )}
        />
        {errors.motive_id && (
          <Text style={styles.errorText}>{errors.motive_id.message}</Text>
        )}
        {/* ESFERAS */}
        {(selectedMotive != "" ||
          Object.values(spheres).reduce((acc, curr) => acc + curr, 0) > 0) &&
          !rechargeSpheres && (
            <>
              <Button
                onPress={() => setShowSpheres(!showSpheres)}
                textColor={showSpheres ? fireBrick(40) : marianBlue(50)}
              >
                {showSpheres ? "Ocultar esferas" : "Mostrar esferas"}
              </Button>
              <View style={{ display: showSpheres ? "flex" : "none" }}>
                <SliderSelectSpheres
                  initialized={!rechargeSpheres}
                  spheres={spheres}
                  control={control}
                  handleSpheresChange={(value, sphere, onChange) => {
                    const formSpheres = getValues().spheres;
                    if (
                      formSpheres !== undefined &&
                      formSpheres[sphere] == value
                    ) {
                      return;
                    }
                    handleSpheresChange(value, sphere, onChange);
                  }}
                />
              </View>
            </>
          )}
        {errors.spheres && (
          <Text style={styles.errorText}>{errors.spheres.message}</Text>
        )}
        <Controller
          control={control}
          name="trigger_id"
          render={({ field: { onChange } }) => (
            <>
              <Text style={{ marginBottom: 5, marginTop: 15 }}>
                Desencadenante
              </Text>
              <SelectList
                defaultOption={triggers.find(
                  (trigger) => trigger.key.toString() == selectedTrigger
                )}
                placeholder="Seleccione un desencadenante"
                onSelect={() => {
                  handleTriggerChange(selectedTrigger, onChange);
                }}
                setSelected={(val: string) => {
                  setSelectedTrigger(val);
                }}
                data={triggers}
                save="value"
              />
            </>
          )}
        />
        {errors.trigger_id && (
          <Text style={styles.errorText}>{errors.trigger_id.message}</Text>
        )}
        {cigar_id ? (
          selectedPersons.length > 0 ? (
            <View>
              <Text style={{ marginBottom: 5, marginTop: 15 }}>Personas</Text>
              <View style={{ marginBottom: 5, marginTop: 5, flexDirection: "row", columnGap: 5}}>
                {selectedPersons.map((sp) => (
                  <Text
                    style={{
                      backgroundColor: "#808080",
                      color: "white",
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      borderRadius: 15
                    }}
                  >
                    {sp}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ marginBottom: 5, marginTop: 15 }}>Personas</Text>
              <Text style={{ marginBottom: 5, marginTop: 5 }}>
                No hay personas asociadas a este cigarro
              </Text>
            </View>
          )
        ) : (
          <Controller
            control={control}
            name="persons"
            render={({ field: { onChange } }) => (
              <>
                <Text style={{ marginBottom: 5, marginTop: 15 }}>Personas</Text>
                <MultipleSelectList
                  placeholder="Seleccione una persona"
                  onSelect={() => {
                    handlePersonChange(selectedPersons, onChange);
                  }}
                  setSelected={(values: string[]) => {
                    setSelectedPersons(values);
                  }}
                  data={persons}
                  save="value"
                />
              </>
            )}
          />
        )}
        {errors.persons && (
          <Text style={styles.errorText}>{errors.persons.message}</Text>
        )}
        <Controller
          control={control}
          name="place_id"
          rules={{ required: "Debe seleccionar un lugar" }}
          render={({ field: { onChange } }) => (
            <>
              <Text style={{ marginBottom: 5, marginTop: 15 }}>Lugar</Text>
              <SelectList
                defaultOption={places.find(
                  (place) => place.key.toString() == selectedPlace
                )}
                placeholder="Seleccione un lugar"
                onSelect={() => {
                  handlePlaceChange(selectedPlace, onChange);
                }}
                setSelected={(val: string) => {
                  setSelectedPlace(val);
                }}
                data={places}
                save="value"
              />
            </>
          )}
        />
        {errors.place_id && (
          <Text style={styles.errorText}>{errors.place_id.message}</Text>
        )}
        <Controller
          control={control}
          name="intensity"
          rules={{ required: "Debe seleccionar una intensidad" }}
          render={({ field: { onChange, value } }) => (
            <>
              {/* Barra de intensidad 4 */}
              <View
                style={{
                  paddingRight: 15,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ marginBottom: 5, marginTop: 15 }}>
                  Intensidad de las ganas de fumar
                </Text>
                <View
                  style={{
                    backgroundColor: fireBrick(10),
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 5,
                  }}
                >
                  <Text>{getValues().intensity}</Text>
                </View>
              </View>
              <Slider
                value={intensity}
                onValueChange={(value) =>
                  handleIntensityChange(value, onChange)
                }
                minimumValue={0}
                step={1}
                maximumValue={10}
                style={styles.slider}
              />
            </>
          )}
        />
        {errors.intensity && (
          <Text style={styles.errorText}>{errors.intensity.message}</Text>
        )}

        {/* Botón para enviar el formulario */}
        <Button
          onPress={handleSubmit(onSubmit)}
          textColor="white"
          style={styles.button}
        >
          {cigarId ? "Actualizar" : "Anotar"} cigarro
        </Button>
      </ScrollView>
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
    marginBottom: 40,
  },
  slider: {
    marginBottom: 20,
  },
});

export default CigarModal;
