import {
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
> {
  return [
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
