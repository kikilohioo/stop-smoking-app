import {
  DBCigarType,
  DBLeaveMotiveType,
  DBMotiveType,
  DBPersonType,
  DBPlaceType,
  DBTriggerType,
  Seeder,
} from "../components/Types";

export default function seeders(): Array<
  | Seeder<DBMotiveType>
  | Seeder<DBLeaveMotiveType>
  | Seeder<DBPlaceType>
  | Seeder<DBPersonType>
  | Seeder<DBTriggerType>
  | Seeder<DBCigarType>
> {
  return [
    {
      table: "cigars",
      data: [
        // Semana del 3 al 9 de febrero
        {
          date_time: "2025-02-03T08:30:12.500Z",
          intensity: 6,
          motive_id: 2,
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
          trigger_id: 1,
          place_id: 2,
          person_id: 2,
        },
        {
          date_time: "2025-02-04T12:15:30.300Z",
          intensity: 7,
          motive_id: 3,
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
          trigger_id: 2,
          place_id: 3,
          person_id: 1,
        },
        {
          date_time: "2025-02-05T14:50:20.100Z",
          intensity: 4,
          motive_id: 1,
          social: 5,
          emotional: 30,
          conductual: 60,
          physiological: 5,
          trigger_id: null,
          place_id: 1,
          person_id: 2,
        },
        {
          date_time: "2025-02-06T18:20:45.900Z",
          intensity: 5,
          motive_id: 2,
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
          trigger_id: 2,
          place_id: 2,
          person_id: 1,
        },
        {
          date_time: "2025-02-07T21:10:33.700Z",
          intensity: 8,
          motive_id: 3,
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
          trigger_id: 1,
          place_id: 3,
          person_id: 2,
        },
        {
          date_time: "2025-02-08T23:55:10.200Z",
          intensity: 6,
          motive_id: 1,
          social: 5,
          emotional: 30,
          conductual: 60,
          physiological: 5,
          trigger_id: null,
          place_id: 1,
          person_id: 1,
        },
        {
          date_time: "2025-02-09T07:40:18.800Z",
          intensity: 7,
          motive_id: 2,
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
          trigger_id: 2,
          place_id: 2,
          person_id: 2,
        },
        // Semana del 10 al 16 de febrero
        {
          date_time: "2025-02-10T09:25:50.500Z",
          intensity: 4,
          motive_id: 3,
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
          trigger_id: 1,
          place_id: 3,
          person_id: 1,
        },
        {
          date_time: "2025-02-11T11:30:15.200Z",
          intensity: 6,
          motive_id: 1,
          social: 5,
          emotional: 30,
          conductual: 60,
          physiological: 5,
          trigger_id: null,
          place_id: 1,
          person_id: 2,
        },
        {
          date_time: "2025-02-12T15:45:40.900Z",
          intensity: 5,
          motive_id: 2,
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
          trigger_id: 2,
          place_id: 2,
          person_id: 1,
        },
        {
          date_time: "2025-02-13T18:05:25.300Z",
          intensity: 8,
          motive_id: 3,
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
          trigger_id: 1,
          place_id: 3,
          person_id: 2,
        },
        {
          date_time: "2025-02-14T20:20:10.100Z",
          intensity: 6,
          motive_id: 1,
          social: 5,
          emotional: 30,
          conductual: 60,
          physiological: 5,
          trigger_id: null,
          place_id: 1,
          person_id: 1,
        },
        {
          date_time: "2025-02-15T22:55:55.800Z",
          intensity: 7,
          motive_id: 2,
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
          trigger_id: 2,
          place_id: 2,
          person_id: 2,
        },
        {
          date_time: "2025-02-16T23:59:59.999Z",
          intensity: 5,
          motive_id: 3,
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
          trigger_id: 1,
          place_id: 3,
          person_id: 1,
        },
      ],
    },
    {
      table: "leave_motives",
      data: [
        {
          name: "Mi primo Feli me lo pidio",
          description:
            "Mi primo de 6 años me pidio que dejara porque tiene miedo de que me muera.",
        },
        {
          name: "Salud",
          description:
            "Me resta en sentirme bien, aparte de que con mi asma hace que todo sea mas dificil",
        },
      ],
    },
    {
      table: "motives",
      data: [
        {
          name: "Entrada al trabajo",
          social: 5,
          emotional: 30,
          conductual: 60,
          physiological: 5,
        },
        {
          name: "Salida del trabajo",
          social: 0,
          emotional: 40,
          conductual: 50,
          physiological: 10,
        },
        {
          name: "Despues de comer",
          social: 5,
          emotional: 55,
          conductual: 40,
          physiological: 0,
        },
      ],
    },
    {
      table: "places",
      data: [
        {
          name: "Mi cuarto",
        },
        {
          name: "Fusionar",
        },
        {
          name: "Super el tio",
        },
      ],
    },
    {
      table: "persons",
      data: [
        {
          name: "Aba",
        },
        {
          name: "Pau",
        },
      ],
    },
    {
      table: "triggers",
      data: [
        {
          name: "Situacion estresando en Fusionar",
        },
        {
          name: "Situacion estresando personal",
        },
      ],
    },
  ];
}
